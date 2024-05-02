import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import AuthRouter from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));

app.use("/api", AuthRouter);

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server working in ${PORT} port.`));
    } catch (e) {
        console.log(e);
    }
};

start();