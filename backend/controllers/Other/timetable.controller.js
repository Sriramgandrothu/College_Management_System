const Timetable = require("../../models/Other/timetable.model");

const getTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.find(req.query);
    if (timetable.length > 0) {
      res.json(timetable);
    } else {
      res.status(404).json({ success: false, message: "Timetable Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const addTimetable = async (req, res) => {
  let { semester, branch } = req.body;
  try {
    let timetable = await Timetable.findOne({ semester, branch });
    if (timetable) {
      await Timetable.findByIdAndUpdate(timetable._id, {
        semester,
        branch,
        link: req.file.filename,
      });
      res.json({ success: true, message: "Timetable Updated!" });
    } else {
      await Timetable.create({
        semester,
        branch,
        link: req.file.filename,
      });
      res.json({ success: true, message: "Timetable Added!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(400).json({ success: false, message: "No Timetable Exists!" });
    }
    res.json({ success: true, message: "Timetable Deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getTimetable, addTimetable, deleteTimetable };
