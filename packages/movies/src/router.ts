import express, { Router } from "express";
import nocache from "nocache";

export const router = Router();

// Parse URL-encoded bodies (as sent by HTML forms)
router.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
router.use(express.json());

router.get("/test", nocache(), (req, res) =>
	res.type("text/plain").send("All good!"),
);
