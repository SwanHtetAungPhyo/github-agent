import {githubCallbackController, githubLoginController, githubLogoutController} from "../../github/github.controller";
import {registerApiRoute} from "@mastra/core/server";
import {Context} from "hono";
import {Session} from "../../middleware/session";
import {mastra} from "../index";
import {RuntimeContext} from "@mastra/core/di";