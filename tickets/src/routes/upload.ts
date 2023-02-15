import { requireAuth } from "@jimtickets/common";
import express, { Express, Request, Response} from "express";
import { Ticket } from "../models/ticket";
// @ts-ignore
import multer, { Multer } from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { BadRequestError } from "@jimtickets/common";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
type FileFilterCallback = (error: Error | null, filter?: boolean) => void
type File = Express.Multer.File 

const router = express.Router();

const storage = multer.diskStorage({
  destination(req: Request, file: File, cb: DestinationCallback) {
    cb(null, "src/uploads/");
  },
  filename(req: Request, file: File, cb: FileNameCallback) {
    console.log("file", file);
    const filename = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`; 
    cb(null, filename);
  }, 
});

function checkFileType(file: File, cb:FileFilterCallback) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('wront file type'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req: Request, file: File, cb: FileFilterCallback) {
    checkFileType(file, cb);
  },
});

router.post(
  "/api/tickets/upload",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    // const file: File = req.file
    const uploadPhoto = await cloudinary.uploader.upload(`${req.file!.path}`);
    if(!uploadPhoto){
        throw new BadRequestError('upload failed, please try again')
    }
    console.log("req.file", req.file);
    console.log(uploadPhoto);
    console.log(uploadPhoto.url);
    res.send({ message: "file uploaded successful", url: uploadPhoto.url });
  }
);

export { router as uploadImageRouter}
