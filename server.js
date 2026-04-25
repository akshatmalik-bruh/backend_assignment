import express from "express";
import helmet from "helmet";
import cors from "cors";
import { PORT } from "./config.js";
import connection from "./db/connection.js";
import authRouter from "./auth/auth.router.js";
import uploadRouter from "./upload/upload.routes.js";
import principalRouter from "./principal/principal.router.js";
import liveRouter from "./live/live.router.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/principal", principalRouter);
app.use("/content", liveRouter);

connection();

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
