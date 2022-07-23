"use strict";
var multer = require("multer");
var express = require("express");
var path = require("path");
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const formatBufferTo64 = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "cao-ng-fpt-polytechnic",
  api_key: "811123551641114",
  api_secret: "6DMIjAlUUCS8tRoJrDNSd_yqqCg",
});
const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);
var router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  'storage': storage,
  // 'storage': multer.memoryStorage(),
  'limits': {
      'fileSize': 1080 * 1920 * 5
  },
  fileFilter: function (req, file, callback) {
      const allowedExtensions = new RegExp(/.(jpg|png|jpeg|gif)$/gi);
      if (!allowedExtensions.test(file.originalname)) return callback(null, false);
      return callback(null, true);
  }
});
const singleUpload = upload.single("file");

router.post("/uploadImage", [singleUpload], async (req, res) => {
  try {
    
    if (!req.file) {
      throw new Error("Image is not presented!");
    }
    const file64 = formatBufferTo64(req.file);
    const uploadResult = await cloudinaryUpload(file64.content);

    return res.json({
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.secure_url,
    });
  } catch (e) {
    return res.status(422).send({ message: e.message });
  }
});

module.exports = router;
