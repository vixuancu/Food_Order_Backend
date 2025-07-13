import bodyParser from "body-parser";
import express, { Application } from "express";
import path from "path";
import { adminRouter, ShoppingRouter, vendorRouter } from "../routes";



export default async (app: Application) => {
    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname,"images"))); //  sử dụng middleware để phục vụ các tệp hình ảnh từ thư mục "images"
app.use("/admin", adminRouter);
app.use("/vendor", vendorRouter);
app.use(ShoppingRouter)

return app;
}

