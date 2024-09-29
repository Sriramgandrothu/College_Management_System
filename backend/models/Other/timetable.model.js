const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
