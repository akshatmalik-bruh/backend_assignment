import { Router } from "express";
import { signupController, signinController, profileController } from "./auth.controllers.js";
import { middleware } from "./auth.middleware.js";

const router = Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.get("/profile", middleware, profileController);

export default router;