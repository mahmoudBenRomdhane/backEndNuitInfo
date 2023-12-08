const multer = require("multer");
const diskStorage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "src/files");
  },
  filename: (req: any, file: any, cb: any) => {
    const mimeType = file.mimetype.split("/");
    const fileType = mimeType[1];
    const fileName = Date.now().toString() + "." + fileType;
    cb(null, fileName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024,
};

export const storage = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: limits,
}).single("file");
