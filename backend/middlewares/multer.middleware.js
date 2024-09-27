const multer = require("multer");
const path = require("path");

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Accept PNG, JPEG/JPG for images, and PDF for materials
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, and PDF files are allowed."), false);
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../media")); // Use absolute path for cross-environment compatibility
  },
  filename: function (req, file, cb) {
    let filename = "";
    const ext = path.extname(file.originalname); // Extract original file extension

    if (req.body?.type === "timetable") {
      filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}${ext}`;
    } else if (req.body?.type === "profile") {
      if (req.body.enrollmentNo) {
        filename = `Student_Profile_${req.body.enrollmentNo}_Semester_${req.body.branch}${ext}`;
      } else {
        filename = `Faculty_Profile_${req.body.employeeId}${ext}`;
      }
    } else if (req.body?.type === "material") {
      filename = `${req.body.title}_Subject_${req.body.subject}.pdf`; // Assuming material will always be a PDF
    }

    cb(null, filename);
  }
});

// Configure multer with storage and file filtering
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,  // Ensuring only allowed file types are uploaded
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB file size limit (adjust as needed)
  }
});

module.exports = upload;