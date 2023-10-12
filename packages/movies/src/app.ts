import express from "express";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";

import morgan from "morgan";

import { router } from "./router";

const app = express();

app.use(
	morgan(
		"[:date[iso]] ACCESS :method :url  :status  :response-time ms - :res[content-length]",
	),
);

app.use(compression());
app.use(cors());
app.use(cookieParser());

// router must be last so that the above middleware can do its job first
app.use("/api/movies", router);
export default app;
