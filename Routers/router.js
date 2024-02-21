import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import * as sendImg from "../Controllers/ControllerInicio.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./Uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const newFilename = `${file.originalname}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

const Router = express.Router();

Router.post("/converter", upload.array("imgs"), sendImg.enviarImg);

export default Router;
