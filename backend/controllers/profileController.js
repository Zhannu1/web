const { User, Resume, Company } = require('../models');
const bcrypt = require('bcrypt');

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Resume },
                { model: Company }
            ]
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (email) user.email = email;
        
        if (oldPassword && newPassword) {
            const isValid = await bcrypt.compare(oldPassword, user.password);
            if (!isValid) {
                return res.status(400).json({ message: "Invalid old password" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        res.status(200).json({ message: "Account updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrUpdateCompany = async (req, res) => {
    try {
        const { companyName, description, website } = req.body;
        const logo = req.file ? req.file.filename : null;

        let company = await Company.findOne({ where: { userId: req.user.id } });

        if (company) {
            const updateData = { companyName, description, website };
            if (logo) updateData.logo = logo;
            company = await company.update(updateData);
        } else {
            company = await Company.create({
                companyName, description, website, logo, userId: req.user.id
            });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrUpdateResume = async (req, res) => {
    try {
        const { Resume } = require('../models');
        
        const fullName = req.body.fullName;
        
        const skills = req.body.skills || '[]';
        const experience = req.body.experience || '[]';
        const education = req.body.education || '[]';
        
        const avatar = req.file ? req.file.filename : null;

        let resume = await Resume.findOne({ where: { userId: req.user.id } });

        if (resume) {
            const updateData = { fullName, skills, experience, education };
            if (avatar) updateData.avatar = avatar;
            await resume.update(updateData);
        } else {
            resume = await Resume.create({
                fullName, skills, experience, education, avatar, userId: req.user.id
            });
        }
        res.status(200).json(resume);
    } catch (error) {
        console.log("RESUME ERROR:", error);
        res.status(400).json({ error: error.message });
    }
};