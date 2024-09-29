const multer = require("multer");
const path = require("path");

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, and PDF files are allowed."), false);
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../media"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    let filename = "";

    switch (req.body.type) {
      case "timetable":
        filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}${ext}`;
        break;
      case "profile":
        filename = req.body.enrollmentNo 
          ? `Student_Profile_${req.body.enrollmentNo}_Semester_${req.body.branch}${ext}` 
          : `Faculty_Profile_${req.body.employeeId}${ext}`;
        break;
      case "material":
        filename = `${req.body.title}_Subject_${req.body.subject}.pdf`;
        break;
      default:
        cb(new Error("Invalid file type specified."), false);
        return;
    }

    cb(null, filename);
  },
});

// Configure multer with storage and file filtering
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
  },
});

module.exports = upload;
