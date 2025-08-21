import { createClient } from "redis";
import { logger } from "../utils/logger";
import { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { randomBytes } from "node:crypto";
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect().catch((err) => {
  logger.error(err.message);
});
interface SessionData {
  [key: string]: any;
}
interface SessionOptions {
  cookieName?: string;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}
export class Session {
  private readonly sessionId: string;
  private data: SessionData = {};
  private isModified = false;
  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }
  async load(): Promise<void> {
    try {
      const sessionData = await redisClient.get(`session:${this.sessionId}`);
      if (sessionData) {
        this.data = JSON.parse(sessionData);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  }
  async save(maxAge: number): Promise<void> {
    if (!this.isModified) return;
    try {
      await redisClient.setEx(
        `session:${this.sessionId}`,
        maxAge,
        JSON.stringify(this.data),
      );
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  }
  get(key: string): any {
    return this.data[key];
  }
  set(key: string, value: any): void {
    this.data[key] = value;
    this.isModified = true;
  }
  delete(key: string): void {
    delete this.data[key];
    this.isModified = true;
  }
  destroy(): void {
    this.data = {};
    this.isModified = true;
    redisClient.del(`session:${this.sessionId}`).catch(console.error);
  }
  getId(): string {
    return this.sessionId;
  }
  getData(): SessionData {
    return { ...this.data };
  }
}
export const sessionMiddleware = (options: SessionOptions = {}) => {
  const {
    cookieName = "sessionId",
    maxAge = 86400, 
    secure = false,
    httpOnly = true,
    sameSite = "Lax",
  } = options;
  return async (c: Context, next: Next) => {
    let sessionId = getCookie(c, cookieName);
    if (!sessionId) {
      sessionId = randomBytes(32).toString("hex");
      setCookie(c, cookieName, sessionId, {
        maxAge,
        secure,
        httpOnly,
        sameSite,
        path: "/",
      });
    }
    const session = new Session(sessionId);
    await session.load();
    c.set("session", session);
    await next();
    await session.save(maxAge);
  };
};