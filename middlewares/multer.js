const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories if not exists
const videoDir = 'uploads/videos';
const thumbnailDir = 'uploads/thumbnails';
const notesDir = 'uploads/notes';

[videoDir, thumbnailDir,notesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define allowed types
const allowedVideoTypes = ['video/mp4', 'video/mkv', 'video/avi'];
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedPdfTypes = ['application/pdf'];
// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video')) {
      cb(null, videoDir);
    } else if (file.mimetype.startsWith('image')) {
      cb(null, thumbnailDir);
    }else if (file.mimetype === 'application/pdf') {
    cb(null, notesDir);
  } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (
    (file.mimetype.startsWith('video') && allowedVideoTypes.includes(file.mimetype)) ||
    (file.mimetype.startsWith('image') && allowedImageTypes.includes(file.mimetype))||
    allowedPdfTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// // Limits (optional)
// const limits = {
//   fileSize: 100 * 1024 * 1024 // 100MB max
// };

const upload = multer({
  storage,
  fileFilter
//  limits
});

module.exports = upload;

