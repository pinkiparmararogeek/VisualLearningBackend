// multerErrorHandler.js
const upload = require("./uploadIcon");
// const uploadClassIcon=require("./")
const multerErrorHandler = (req, res, next) => {
  const uploadSingle = upload.single("icon");

  uploadSingle(req, res, function (err) {
    if (err) {
      if (err.message === "Only PNG images are allowed.") {
        return res.status(400).json({ status: false, message: err.message });
      }

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ status: false, message: "File size too large (Max 1.5MB)" });
      }

      return res.status(400).json({ status: false, message: "Image upload failed", error: err.message });
    }
    next();
  });
};

module.exports = multerErrorHandler;
