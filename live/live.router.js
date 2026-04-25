import { Router } from "express";
import { getLiveContentController } from "./live.controller.js";

const router = Router();


router.get("/live/:teacherId", getLiveContentController);

export default router;
