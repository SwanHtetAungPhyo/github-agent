import { Context, Next } from "hono";
import { logger } from "../utils/logger";
export const githubErrorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (e) {
    logger.error("Github API error", e);
    if (e instanceof Error && e.message.includes("rate limit")) {
      return c.json(
        {
          error: "GitHub API rate limit exceeded",
          message: "Please try again later",
          retryAfter: "60 seconds",
        },
        429,
      );
    }
    if (e instanceof Error && e.message.includes("401")) {
      return c.json(
        {
          error: "GitHub authentication failed",
          message: "Please re-authenticate with GitHub",
          action: "redirect_to_login",
        },
        401,
      );
    }
    if (e instanceof Error && e.message.includes("403")) {
      return c.json(
        {
          error: "GitHub permission denied",
          message: "Insufficient permissions to access this resource",
          suggestion: "Check repository permissions or OAuth scopes",
        },
        403,
      );
    }
    return c.json(
      {
        error: "GitHub API request failed",
        message: "An error occurred while communicating with GitHub",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      500,
    );
  }
};