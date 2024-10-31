const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../../helpers/error/CustomError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename);
    cb(null, path.join(rootDir, "public/images"));
  },
  filename: function (req, file, cb) {
    const randomId = uuidv4();
    const extension = file.mimetype.split("/")[1];
    req.savedImages = req.savedImages || [];
    const savedImage =
    file.fieldname === "food_image"
      ? "food_" + randomId + "_" + "." + extension
      : file.fieldname === "food_recog_image"
      ? "food_recog_" + randomId + "_" + "." + extension
      : file.fieldname === "cover_image"
      ? "cover_" + randomId + "_" + "." + extension
      : file.fieldname === "market_image" 
      ? "market_" + randomId + "_" + "." + extension 
      : "user_" + randomId + "_" + "." + extension;

        
    req.savedImages.push(savedImage);
    cb(null, savedImage);
  },
});

const fileFilter = (req, file, cb) => {
  let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new CustomError("Please provide a valid image file", 400), false);
  }
  return cb(null, true);
};

const imageUpload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB'ye kadar dosya boyutu sınırı
  } 
});

module.exports = imageUpload;
