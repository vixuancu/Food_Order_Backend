import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { MONGO_URI } from "./config";
import { adminRouter, vendorRouter } from "./routes";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname,"images"))); //  sử dụng middleware để phục vụ các tệp hình ảnh từ thư mục "images"
app.use("/admin", adminRouter);
app.use("/vendor", vendorRouter);

mongoose.connect(MONGO_URI)
  .then(result => {
    console.log("Connected to MongoDB successfully/ thanh cong");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
app.listen(8000, () => {
  console.clear();
  console.log("Server is running on port 8000");
});
