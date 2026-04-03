const { Resume } = require('../models');

exports.createResume = async (req, res) => {
    try {
        const { fullName, skills, experience, education } = req.body;
        const avatar = req.file ? req.file.filename : null;
        
        const existingResume = await Resume.findOne({ where: { userId: req.user.id } });
        if (existingResume) {
            return res.status(400).json({ message: "Resume already exists. Use PUT to update." });
        }

        const resume = await Resume.create({
            fullName,
            skills,
            experience,
            education,
            avatar,
            userId: req.user.id
        });
        
        res.status(201).json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getResumes = async (req, res) => {
    try {
        const resumes = await Resume.findAll();
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findByPk(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateResume = async (req, res) => {
    try {
        const resume = await Resume.findByPk(req.params.id);
        
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        if (resume.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Access denied" });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.avatar = req.file.filename;
        }

        await resume.update(updateData);
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findByPk(req.params.id);
        
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        if (resume.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Access denied" });
        }

        await resume.destroy();
        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};