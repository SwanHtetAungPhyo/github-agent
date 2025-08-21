import { Context } from "hono";
import { Session } from "../middleware/session";
export const githubLoginController = async (c: Context) => {
  const session = c.get("session") as Session;
  console.log("Login - Session ID:", session.getId()); 
  const state =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  session.set("oauth_state", state);
  await session.save(86400); 
  console.log("Login - Stored state:", state); 
  const param = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID as string,
    redirect_uri: process.env.GITHUB_REDIRECT_URI as string,
    scope: process.env.GITHUB_SCOPE as string,
    state: state,
    response_type: "code",
  });
  const githubAuthorizerUrl = process.env.GITHUB_AUTHORIZER_URL as string;
  const authUrl = `${githubAuthorizerUrl}?${param.toString()}`;
  return c.redirect(authUrl);
};
export const githubCallbackController = async (c: Context) => {
  const session = c.get("session") as Session;
  const url = new URL(c.req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  console.log("Callback - Session ID:", session.getId()); 
  console.log("Callback - Received state:", state); 
  const sessionState = session.get("oauth_state");
  console.log("Callback - Session state:", sessionState); 
  console.log("Callback - All session data:", session.getData()); 
  if (error) {
    return c.json(
      {
        error: "OAuth authorization failed",
        details: error,
        description: url.searchParams.get("error_description"),
      },
      400,
    );
  }
  if (!state || state !== sessionState) {
    return c.json(
      {
        error: "Invalid state parameter - possible CSRF attack",
        debug: {
          receivedState: state,
          sessionState: sessionState,
          sessionId: session.getId(),
          hasSessionState: !!sessionState,
          statesMatch: state === sessionState,
        },
      },
      400,
    );
  }
  if (!code) {
    return c.json(
      {
        error: "Authorization code not provided",
      },
      400,
    );
  }
  try {
    const tokenUrl = process.env.GITHUB_TOKEN_URL as string;
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID as string,
        client_secret: process.env.GITHUB_CLIENT_SECRET as string,
        code: code as string,
        redirect_uri: process.env.GITHUB_REDIRECT_URI as string,
      }),
    });
    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }
    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return c.json(
        {
          error: "Token exchange failed",
          details: tokenData.error_description || tokenData.error,
        },
        400,
      );
    }
    const accessToken = tokenData.access_token;
    const tokenType = tokenData.token_type || "Bearer";
    const scope = tokenData.scope;
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Mastra-App",
      },
    });
    if (!userResponse.ok) {
      throw new Error(`User info fetch failed: ${userResponse.status}`);
    }
    const userData = await userResponse.json();
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Mastra-App",
      },
    });
    let primaryEmail = userData.email;
    if (emailResponse.ok) {
      const emails = await emailResponse.json();
      const primary = emails.find((email: any) => email.primary);
      if (primary) {
        primaryEmail = primary.email;
      }
    }
    session.set("isAuthenticated", true);
    session.set("userId", userData.id);
    session.set("username", userData.login);
    session.set("email", primaryEmail);
    session.set("github_access_token", accessToken);
    session.set("github_token_type", tokenType);
    session.set("github_scope", scope);
    session.set("github_user_data", {
      id: userData.id,
      login: userData.login,
      name: userData.name,
      email: primaryEmail,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      company: userData.company,
      location: userData.location,
      blog: userData.blog,
      twitter_username: userData.twitter_username,
      public_repos: userData.public_repos,
      public_gists: userData.public_gists,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    });
    session.set("loginTime", new Date().toISOString());
    session.delete("oauth_state");
    const redirectUrl = session.get("redirect_after_login") || "/dashboard";
    session.delete("redirect_after_login");
    return c.redirect(redirectUrl);
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    session.delete("oauth_state");
    return c.json(
      {
        error: "Authentication failed",
        message: "Unable to complete GitHub authentication",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
};
export const githubLogoutController = async (c: Context) => {
  const session = c.get("session") as Session;
  const accessToken = session.get("github_access_token");
  if (accessToken) {
    try {
      await fetch(
        `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString("base64")}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        },
      );
    } catch (error) {
      console.error("Failed to revoke GitHub token:", error);
    }
  }
  session.destroy();
  return c.json({
    success: true,
    message: "Logged out successfully",
  });
};
export const githubProfileController = async (c: Context) => {
  const session = c.get("session") as Session;
  if (!session.get("isAuthenticated")) {
    return c.json({ error: "Not authenticated" }, 401);
  }
  const githubUserData = session.get("github_user_data");
  const loginTime = session.get("loginTime");
  const scope = session.get("github_scope");
  return c.json({
    user: githubUserData,
    session: {
      loginTime,
      scope,
      isAuthenticated: true,
    },
  });
};
export const githubRefreshTokenController = async (c: Context) => {
  const session = c.get("session") as Session;
  const accessToken = session.get("github_access_token");
  if (!accessToken) {
    return c.json({ error: "No access token found" }, 401);
  }
  try {
    const testResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Mastra-App",
      },
    });
    if (testResponse.ok) {
      return c.json({
        valid: true,
        message: "Token is still valid",
      });
    } else if (testResponse.status === 401) {
      session.destroy();
      return c.json(
        {
          valid: false,
          message: "Token is invalid, please re-authenticate",
        },
        401,
      );
    } else {
      throw new Error(`Token validation failed: ${testResponse.status}`);
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return c.json(
      {
        error: "Failed to validate token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
};