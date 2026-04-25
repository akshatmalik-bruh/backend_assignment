import { Router } from "express";
import { 
    getContentController, 
    approveContentController, 
    rejectContentController 
} from "./principal.controllers.js";
import { middleware } from "../auth/auth.middleware.js";

const router = Router();


router.use(middleware);


router.get("/content", getContentController);
router.post("/approve/:id", approveContentController);
router.post("/reject/:id", rejectContentController);

export default router;