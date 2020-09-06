const multer = require("multer");

const MimeType = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const multerStorage = multer.diskStorage({
  // file path
  destination: (req, file, cb) => {
    const isValid = MimeType[file.mimetype];
    let error = new Error(
      "Upload file Type cannot be other than Image file type ."
    );
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); // this is relative to server.js file path
  },
  // name of the file
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MimeType[file.mimetype];
    cb(null, fileName + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage: multerStorage }).single("image");
