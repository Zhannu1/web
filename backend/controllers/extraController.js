const { SavedJob, Job, Category, User, Application } = require('../models');
const { Op } = require('sequelize');
const { Message } = require('../models'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.getSavedJobs = async (req, res) => {
    try {
        const saved = await SavedJob.findAll({
            where: { userId: req.user.id },
            include: [{ model: Job }]
        });
        res.status(200).json(saved);
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

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const jobCount = await Job.count();
        const applicationCount = await Application.count();
        res.status(200).json({ userCount, jobCount, applicationCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const { Notification } = require('../models');
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'role'] 
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params; 
        const myId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: myId, receiverId: userId },
                    { senderId: userId, receiverId: myId }
                ]
            },
            order: [['createdAt', 'ASC']] 
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { Message, Notification, User } = require('../models');
        const { receiverId, content } = req.body;

        const message = await Message.create({
            senderId: req.user.id,
            receiverId,
            content
        });

        const sender = await User.findByPk(req.user.id);
        const senderName = sender.email.split('@')[0];

        if (receiverId !== 'ai') {
            await Notification.create({
                userId: receiverId,
                message: `${senderName} сізге жаңа хабарлама жазды: "${content.substring(0, 30)}..."`
            });
        }

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.toggleSavedJob = async (req, res) => {
    try {
        const { SavedJob } = require('../models');
        const { jobId } = req.body;
        const userId = req.user.id;

        const existing = await SavedJob.findOne({ where: { userId, jobId } });
        
        if (existing) {

            await existing.destroy();
            return res.status(200).json({ message: 'Вакансии сақталғандардан өшірілді', isSaved: false });
        } else {
            await SavedJob.create({ userId, jobId });
            return res.status(200).json({ message: 'Вакансия сақталды', isSaved: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getChatContacts = async (req, res) => {
    try {
        const { Application, Job, User } = require('../models');
        const myId = req.user.id;
        const myRole = req.user.role;
        let contactsMap = new Map();

        if (myRole === 'USER') {
            const apps = await Application.findAll({
                where: { userId: myId, status: 'ACCEPTED' },
                include: [{ 
                    model: Job, 
                    include: [{ model: User, as: 'employer', attributes: ['id', 'email', 'role'] }] 
                }]
            });
            apps.forEach(app => {
                if (app.Job && app.Job.employer) {
                    contactsMap.set(app.Job.employer.id, app.Job.employer);
                }
            });
        } else if (myRole === 'EMPLOYER') {
            const apps = await Application.findAll({
                where: { status: 'ACCEPTED' },
                include: [
                    { model: Job, where: { userId: myId } },
                    { model: User, attributes: ['id', 'email', 'role'] }
                ]
            });
            apps.forEach(app => {
                if (app.User) {
                    contactsMap.set(app.User.id, app.User);
                }
            });
        }

        res.status(200).json(Array.from(contactsMap.values()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ reply: "Кешіріңіз, AI жүйесі бапталмаған (API кілт жоқ)." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
            Сіз "JobPortal" жұмыс іздеу платформасының ресми AI көмекшісісіз. 
            Сіздің мақсатыңыз: Қолданушыларға жұмыс іздеуге, түйіндеме (резюме) жазуға, сұхбатқа (интервью) дайындалуға және карьералық кеңестер беруге көмектесу.
            Егер қолданушы басқа (жұмысқа қатысы жоқ) тақырыпта сұрақ қойса, сыпайы түрде өзіңіздің тек карьера мен жұмысқа байланысты сұрақтарға жауап беретініңізді айтыңыз.
            Жауаптарыңыз қазақ тілінде, сауатты, достық пейілде және қысқа әрі нұсқа (максимум 3-4 сөйлем) болуы керек.

            Қолданушының сұрағы: "${message}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ reply: "Кешіріңіз, менде қазір техникалық ақаулар болып жатыр. Сәлден соң қайталап көріңізші." });
    }
};