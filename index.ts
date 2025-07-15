import dotenv from "dotenv";
dotenv.config();

import express from "express";
import App from "./src/services/expressApp";
import DbConnect from "./src/services/database";
import { PORT } from "./src/config";

const StartServer = async () => {
  const app = express();
  await DbConnect();
  await App(app);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
StartServer();
