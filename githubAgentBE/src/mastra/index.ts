import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { storage } from "./memory/memory";
import { middlwares } from "../middleware/middleware";
import { mainAgent } from "./agents/githubagent";
import { githubCallbackController, githubLoginController, githubLogoutController } from "../github/github.controller";
import { Context } from "hono";
import { Session } from "../middleware/session";
import { registerApiRoute } from "@mastra/core/server";
import { RuntimeContext } from "@mastra/core/di";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().describe("The user's message/question"),
  threadId: z.string().optional().describe("Optional existing thread ID to continue conversation"),
});

export const mastra = new Mastra({
  agents: { mainAgent },
  storage: storage,
  server: {
    port: 3000,
    host: "0.0.0.0",
    build: {
      swaggerUI: true,
    },
    middleware: middlwares,
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    },
    apiRoutes: [
      registerApiRoute("/auth/github", {
        method: "GET",
        handler: githubLoginController,
      }),
      registerApiRoute("/auth/github/callback", {
        method: "GET",
        handler: githubCallbackController,
      }),
      registerApiRoute("/auth/github/logout", {
        method: "POST",
        handler: githubLogoutController,
      }),
      registerApiRoute("/auth/status", {
        method: "GET",
        handler: async (c: Context) => {
          const session = c.get("session") as Session;
          if (!session.get("isAuthenticated")) {
            return c.json({
              authenticated: false
            });
          }
          const githubUserData = session.get("github_user_data");
          const loginTime = session.get("loginTime");
          return c.json({
            authenticated: true,
            user: githubUserData,
            loginTime
          });
        }
      }),
      registerApiRoute('/health', {
        method: "GET",
        handler: async (c: Context) => {
          return c.json({
            status: 'ok',
            timestamp: new Date().toISOString()
          });
        }
      }),
      registerApiRoute("/chat", {
        method: "POST",
        handler: async (c: Context) => {
          try {
            console.log("Chat handler - Request method:", c.req.method);
            console.log("Chat handler - Request headers:", Object.fromEntries(c.req.raw.headers.entries()));
            const body = await c.req.json();
            const { message, threadId } = chatRequestSchema.parse(body);
            const session = c.get("session") as Session;
            console.log("Chat handler - Session ID:", session.getId());
            console.log("Chat handler - Message:", message);
            console.log("Chat handler - Thread ID:", threadId);
            console.log("Chat handler - Is authenticated:", session.get("isAuthenticated"));
            console.log("Chat handler - GitHub token exists:", !!session.get("github_access_token"));
            const authToken = session.get("github_access_token");
            const runtimeContext = new RuntimeContext();
            if (!authToken) {
              return c.json(
                  {
                    error: "GitHub authentication required",
                    message: "Please authenticate with GitHub first",
                    debug: {
                      sessionId: session.getId(),
                      isAuthenticated: session.get("isAuthenticated"),
                    },
                  },
                  401
              );
            }
            runtimeContext.set("githubToken", authToken);
            const agent = mastra.getAgent("mainAgent");
            const currentThreadId = threadId || `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const result = await agent.generate(message, {
              runtimeContext,
            });
            return c.json({
              success: true,
              threadId: result.response.id,
              message: result.text,
              details: {
                finishReason: result.finishReason,
                usage: result.usage,
                toolsUsed: result.toolCalls?.map((call) => call.toolName) || [],
                timestamp: new Date().toISOString(),
              },
              toolResults: result.toolResults?.map((tr) => ({
                toolName: tr.toolCallId,
                result: tr.result
              })) || [],
            });
          } catch (error) {
            console.error("Chat handler error:", error);
            if (error instanceof z.ZodError) {
              return c.json({
                success: false,
                error: "Invalid request format",
                details: error.errors,
              }, 400);
            }
            return c.json({
              success: false,
              error: "Internal server error",
              message: error instanceof Error ? error.message : "Unknown error occurred",
            }, 500);
          }
        }
      })
    ],
  },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});