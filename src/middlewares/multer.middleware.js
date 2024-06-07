import multer from "multer";


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/temp/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
  //change file name
});

export const upload = multer({ storage });