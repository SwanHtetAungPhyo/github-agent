import { Context, Next } from "hono";
export const loggerMiddleware = async (c: Context, next: Next) => {
  const start = Date.now();
  const method = c.req.method;
  const url = c.req.url;
  console.log(`[${new Date().toISOString()}] ${method} ${url} - Starting`);
  await next();
  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${duration}ms`);
};