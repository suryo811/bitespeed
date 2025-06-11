import express, { Request, Response, Application } from "express";
import "dotenv/config";

const app: Application = express();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
