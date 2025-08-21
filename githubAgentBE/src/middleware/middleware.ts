import {loggerMiddleware} from "./logger";
import {sessionMiddleware} from "./session";
import {corsHandler} from "./cors";
export const middlwares = [
    corsHandler,
    loggerMiddleware,
    sessionMiddleware({
        cookieName: "mastra_session",
        maxAge: 86400,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "Lax",
    }),
]