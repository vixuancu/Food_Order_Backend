import dotenv from "dotenv";
dotenv.config();

import express from "express";
import App from "./services/expressApp";
import DbConnect from "./services/database";

const StartServer = async () => {
  const app = express();
  await DbConnect();
  await App(app);

  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
};
StartServer();
