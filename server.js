import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { PORT } from "./config.js";
import connection from "./db/connection.js";
import authRouter from "./auth/auth.router.js";
import uploadRouter from "./upload/upload.routes.js";
import principalRouter from "./principal/principal.router.js";
import liveRouter from "./live/live.router.js";

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
});

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/principal", principalRouter);
app.use("/content", liveRouter);

// Health Check / Assignment Identity
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Akshat Malik - Backend Assignment API is Live",
        status: "Healthy",
        version: "1.0.0"
    });
});

connection();

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
