const Notice = require("../../models/Other/notice.model");

const getNotice = async (req, res) => {
    try {
        const { role } = req.body; // Assuming role is passed in the request body
        let notices;

        if (role === "student") {
            // Students should only see notices meant for students
            notices = await Notice.find({ type: { $in: ["student", "both"] } });
        } else if (role === "faculty") {
            /// Faculty should see all notices
            notices = await Notice.find({});
        } else if (role === "admin") {
            // Admin should see all notices
            notices = await Notice.find({});
        } else {
            // If role is not recognized, return an error
            return res.status(400).json({ success: false, message: "Invalid role!" });
        }

        if (notices.length > 0) {
            res.json({ success: true, message: "Notices retrieved successfully", notices });
        } else {
            res.status(404).json({ success: false, message: "No notices available!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const addNotice = async (req, res) => {
    let { link, description, title, type } = req.body;
    try {
        let noticeExists = await Notice.findOne({ link, description, title, type });
        if (noticeExists) {
            return res.status(400).json({ success: false, message: "Notice already exists!" });
        }

        // Determine visibility based on type
        let typesToSave;
        if (type === "student") {
            typesToSave = ["student", "both"];
        } else if (type === "faculty") {
            typesToSave = ["faculty", "student","both"];
        } else {
            typesToSave = [type];
        }

        await Notice.create({
            link,
            description,
            title,
            type: typesToSave, // Save multiple types
        });
        res.json({ success: true, message: "Notice added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateNotice = async (req, res) => {
    let { link, description, title, type } = req.body;
    try {
        let notice = await Notice.findByIdAndUpdate(req.params.id, { link, description, title, type }, { new: true });
        if (!notice) {
            return res.status(400).json({ success: false, message: "No notice available!" });
        }
        res.json({ success: true, message: "Notice updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteNotice = async (req, res) => {
    try {
        let notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) {
            return res.status(400).json({ success: false, message: "No notice available!" });
        }
        res.json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getNotice, addNotice, updateNotice, deleteNotice };
