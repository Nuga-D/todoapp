const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = function (req, file, cb) {
   // Allow all file types
   cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).array('files', 10);

module.exports = upload;