import { Context, Next } from "hono";
export const corsHandler = async (c: Context, next: Next) => {
  console.log(`🔍 CORS Middleware: ${c.req.method} ${c.req.url}`);
  console.log(`🔍 Origin: ${c.req.header("Origin")}`);
  console.log(`🔍 Request headers:`, Object.fromEntries(c.req.raw.headers.entries()));
  const origin = c.req.header("Origin");
  const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:3000",
  ];
  if (origin && allowedOrigins.includes(origin)) {
    c.header("Access-Control-Allow-Origin", origin);
    console.log(`✅ Set Access-Control-Allow-Origin to: ${origin}`);
  } else {
    c.header("Access-Control-Allow-Origin", "http://localhost:3001");
    console.log(`✅ Set default Access-Control-Allow-Origin to: http://localhost:3001`);
  }
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, X-Requested-With");
  c.header("Access-Control-Allow-Credentials", "true");
  c.header("Access-Control-Max-Age", "86400");
  if (c.req.method === "OPTIONS") {
    console.log("🚀 Handling OPTIONS preflight request");
    const responseOrigin = origin && allowedOrigins.includes(origin) ? origin : "http://localhost:3001";
    console.log("📤 OPTIONS Response headers:", {
      "Access-Control-Allow-Origin": responseOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    });
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": responseOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie, X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      }
    });
  }
  await next();
  console.log("📤 Final response headers:", Object.fromEntries(c.res.headers.entries()));
};