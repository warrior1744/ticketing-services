import { requireAuth } from "@jimtickets/common";
import express, { Express, Request, Response} from "express";
import { Ticket } from "../models/ticket";
// @ts-ignore
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { BadRequestError } from "@jimtickets/common";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
type FileFilterCallback = (error: Error | null, filter?: boolean) => void
type File = Express.Multer.File 

const router = express.Router();

const storage = multer.diskStorage({
  destination(req: Request, file, cb) {
    cb(null, "../uploads");
  },
  filename(req: Request, file, cb) {
    console.log("file", file);
    const filename = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`; 
    cb(null, filename);
  }, 
});

function checkFileType(file: any, cb: any) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('wront file type');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req: Request, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fieldSize: 5242880}
});

router.post(
  "/api/tickets/upload",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    console.log('req.file', req.file)

    if(req.file!.size > 3145728){
      throw new BadRequestError('File must be less than 3mb')
    }
    const uploadPhoto = await cloudinary.uploader.upload(`${req.file!.path}`);
    
    if(!uploadPhoto){
        throw new BadRequestError('upload failed, please try again')
    }
    res.send({ message: "file uploaded successful", url: uploadPhoto.url });
  }
);

export { router as uploadImageRouter}
