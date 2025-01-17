import multer from "multer";

import { TEMP_UPLOAD_DIR } from "../constants/index.js";

const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     // cb(new Error("Cannot upload file"));
    //     cb(null, TEMP_UPLOAD_DIR);
    // }
    destination: TEMP_UPLOAD_DIR,
    fileName: (req, file, cb) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePrefix}_${file.originalname}`;
        cb(null, filename);
    }
});

export const upload = multer({
    storage,
});