const { User, Job, Application, Company, Category, sequelize } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalEmployers = await User.count({ where: { role: 'EMPLOYER' } });
        const totalSeekers = await User.count({ where: { role: 'USER' } });
        const totalJobs = await Job.count();
        const totalApplications = await Application.count();
        const totalCompanies = await Company.count();

        const dbType = sequelize.getDialect();
        let dateGroup;

        if (dbType === 'postgres') {
            dateGroup = Sequelize.fn('to_char', Sequelize.col('createdAt'), 'YYYY-MM-DD');
        } else {
            dateGroup = Sequelize.fn('date', Sequelize.col('createdAt'));
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const userDynamics = await User.findAll({
            attributes: [
                [dateGroup, 'day'],
                [Sequelize.fn('count', Sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: { [Op.gte]: sevenDaysAgo }
            },
            group: [Sequelize.col('day')],
            order: [[Sequelize.col('day'), 'ASC']],
            raw: true
        });

        const jobDynamics = await Job.findAll({
            attributes: [
                [dateGroup, 'day'],
                [Sequelize.fn('count', Sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: { [Op.gte]: sevenDaysAgo }
            },
            group: [Sequelize.col('day')],
            order: [[Sequelize.col('day'), 'ASC']],
            raw: true
        });

        res.status(200).json({
            cards: {
                totalUsers,
                totalEmployers,
                totalSeekers,
                totalJobs,
                totalApplications,
                totalCompanies
            },
            charts: {
                userDynamics,
                jobDynamics
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            include: [{ model: User, as: 'employer', attributes: ['email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        await Job.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create({ name: req.body.name });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};