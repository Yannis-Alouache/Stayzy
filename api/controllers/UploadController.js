const express = require('express');
const multer = require('multer');
const imageDownloader = require('image-downloader');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');

const bucket = 'dawid-booking-app';

class UploadController {
  constructor() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        const sanitizedFileName = path.parse(file.originalname).name.replace(/ /g, "_");
        const newFileName = `${sanitizedFileName}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, newFileName);
      },
    });

    this.router = express.Router();
    this.photosMiddleware = multer({ storage });
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/upload-by-link', this.uploadByLink.bind(this));
    this.router.post('/', this.photosMiddleware.array('photos', 100), this.uploadPhotos.bind(this));
  }

  async uploadByLink(req, res) {
    try {
      const { link } = req.body;
      const newName = `photo${Date.now()}.jpg`;
      await imageDownloader.image({
        url: link,
        dest: path.join(__dirname, '..', 'uploads', newName),
      });
      res.json(newName);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error downloading the image.');
    }
  }

  async uploadPhotos(req, res) {
    try {
      const uploadedFiles = req.files.map(file => file.filename);
      res.json(uploadedFiles);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading the photos.');
    }
  }
}

module.exports = UploadController;
