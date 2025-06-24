const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure category icon directory exists
const categoryIconDir = 'uploads/icons';
if (!fs.existsSync(categoryIconDir)) {
  fs.mkdirSync(categoryIconDir, { recursive: true });
}

// PNG-only storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryIconDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

// PNG-only filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG images are allowed.'), false);
  }
};

const uploadCategoryIcon = multer({ storage, fileFilter });

module.exports = uploadCategoryIcon;
