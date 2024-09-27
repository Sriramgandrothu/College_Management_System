const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({

  branch: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  file: {
    type: String, // Store the filename (or full path if you prefer)
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

<<<<<<< HEAD
module.exports = mongoose.model("Timetable", TimeTable);
=======
module.exports = mongoose.model("Timetable", timetableSchema);
>>>>>>> 0ec52ea674343633dd2883846137a2a3a28402b5
