const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const myLoc = "public/images";
    cb(null, myLoc);
    
  },
  filename: function (req, file, cb) {
    const myName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, myName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        const err = new Error('Only .png, .jpg and .jpeg format allowed!')
        err.name = 'ExtensionError'
        return cb(err);
    }}}    
);
module.exports = upload;
