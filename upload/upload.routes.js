import { Router } from "express";
import { uploadController } from "./upload.controllers.js";
import { uploadMiddleware } from "./upload.middleware.js";
import { middleware } from "../auth/auth.middleware.js";

const router = Router();

router.post("/upload", middleware, uploadMiddleware(), uploadController);

export default router;