const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/products");

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];

    if (!acceptableExt.includes(path.extname(file.originalname))) {
        return callback(new Error("Only .png .jpg .jpeg fromat is allowed!"));
    }

    const fileSize = parseInt(req.headers["content-length"]);

    if (file > 200000) {
        return callback(new Error("File size is too big!"));
    }

    callback(null, true);
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 200000,
});

module.exports = upload.single("productImg");