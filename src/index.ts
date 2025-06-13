import express, { Request, Response, Application } from "express";
import "dotenv/config";
import identifyRouter from "./identify.js";

const app: Application = express();
app.use(express.json());

// health check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/identify", identifyRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
