const { Application, Job, Resume, User } = require('../models');

exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id;

        const resume = await Resume.findOne({ where: { userId } });
        if (!resume) {
            return res.status(400).json({ message: "You need to create a resume first" });
        }

        const existingApplication = await Application.findOne({ where: { jobId, userId } });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const application = await Application.create({
            jobId,
            userId,
            resumeId: resume.id
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Access denied" });
        }

        const applications = await Application.findAll({
            where: { jobId },
            include: [
                { model: User, attributes: ['id', 'email'] },
                { model: Resume }
            ]
        });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: { userId: req.user.id },
            include: [
                { model: Job }
            ]
        });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { Application } = require('../models');
        const { status } = req.body; 

        const application = await Application.findByPk(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Өтініш табылмады' });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ message: 'Статус сәтті өзгертілді', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};