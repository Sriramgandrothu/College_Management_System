const Notice = require("../../models/Other/notice.model");

const getNotice = async (req, res) => {
    try {
        const { role } = req.query; // Use req.query instead of req.body
        let notices;

        // Fetch notices based on user role
        if (role === "student") {
            notices = await Notice.find({ type: { $in: ["student", "both"] } });
        } else if (role === "faculty") {
            // Faculty should see notices for faculty and students
            notices = await Notice.find({});
        } else if (role === "admin") {
            notices = await Notice.find({});
        } else {
            return res.status(400).json({ success: false, message: "Invalid role!" });
        }

        return res.json({ success: true, message: "Notices retrieved successfully", notices });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const addNotice = async (req, res) => {
    try {
        const { title, description, type, link } = req.body;

        // Ensure type is a single string, not an array
        if (Array.isArray(type)) {
            return res.status(400).json({ success: false, message: "Type must be a single string value." });
        }

        const newNotice = new Notice({
            title,
            description,
            type, // Make sure this is a string
            link,
        });

        await newNotice.save();
        res.status(201).json({ success: true, message: "Notice added successfully", notice: newNotice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateNotice = async (req, res) => {
    try {
        const { link, description, title, type } = req.body;
        const notice = await Notice.findByIdAndUpdate(req.params.id, { link, description, title, type }, { new: true });
        
        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found!" });
        }
        return res.json({ success: true, message: "Notice updated successfully", notice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found!" });
        }
        return res.json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getNotice, addNotice, updateNotice, deleteNotice };
