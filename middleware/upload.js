const multer = require('multer'); // Imports Multer for file uploads

// Configures where and how files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Saves files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Names files with timestamp to avoid conflicts
  }
});

// Initializes Multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload; // Exports the upload middleware