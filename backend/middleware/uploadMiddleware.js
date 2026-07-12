const multer = require("multer");
const path = require("path");

// Store uploaded files in uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Accept only CSV files
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "text/csv" ||
        file.originalname.endsWith(".csv")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only CSV files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;