import { Router } from "express";
import prisma from "./config/db.js";

const router = Router();

router.post("/", async (req, res) => {
  res.send("Hello World");
});

export default router;
