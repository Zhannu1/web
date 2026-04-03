const { Job, Category, User, Application } = require('../models');
const { Op } = require('sequelize');

exports.getJobs = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, categoryId } = req.query;
        const offset = (page - 1) * limit;
        let whereClause = {};

        if (search) {
            whereClause.title = { [Op.iLike]: `%${search}%` };
        }
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        const jobs = await Job.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                { model: Category, attributes: ['name'] },
                { model: User, as: 'employer', attributes: ['email'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalItems: jobs.count,
            totalPages: Math.ceil(jobs.count / limit),
            currentPage: parseInt(page),
            data: jobs.rows
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: { userId: req.user.id },
            include: [{ model: Application, attributes: ['id'] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(jobs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: User, as: 'employer', attributes: ['email'] }
            ]
        });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        const { title, description, company, salary, categoryId } = req.body;
        const logo = req.file ? req.file.filename : null;

        const job = await Job.create({
            title, description, company, salary, categoryId, logo, userId: req.user.id
        });
        res.status(201).json(job);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};