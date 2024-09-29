const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: [String], // Change to an array to support multiple types
    required: true,
  },
  link: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
