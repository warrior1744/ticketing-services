import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import path from "path";
import { createTicketRouter } from "./routes/new";
import { myTicketRouter } from "./routes/my";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
import { uploadImageRouter } from "./routes/upload";
import { deleteTicketRouter } from "./routes/delete";

import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@jimtickets/common";
import { v2 as cloudinary } from "cloudinary";

const app = express();
app.set("trust proxy", true); //traffic proxied through ingress nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable encryption (commonly used)
    secure: true, //process.env.NODE_ENV !== 'test' //use https connection
  })
);

app.use("/uploads", express.static(path.join(__dirname, "..", "/uploads")));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use(currentUser);
app.use(createTicketRouter);
app.use(myTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.use(uploadImageRouter);
app.use(deleteTicketRouter);

app.get("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
