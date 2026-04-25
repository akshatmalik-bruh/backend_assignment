import express from "express";
import helmet from "helmet";
import { PORT } from "./config.js";
import connection from "./db/connection.js";
import authRouter from "./auth/auth.router.js";
import uploadRouter from "./upload/upload.routes.js";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

connection();

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
