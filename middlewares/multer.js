const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories if not exists
const videoDir = 'uploads/videos';
const thumbnailDir = 'uploads/thumbnails';
[videoDir, thumbnailDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video');
    cb(null, isVideo ? videoDir : thumbnailDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
module.exports = upload;
