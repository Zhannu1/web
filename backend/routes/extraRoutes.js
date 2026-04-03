const express = require('express');
const router = express.Router();
const extraController = require('../controllers/extraController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/notifications', authMiddleware, extraController.getNotifications);

router.post('/saved-jobs', authMiddleware, extraController.toggleSavedJob);
router.get('/saved-jobs', authMiddleware, extraController.getSavedJobs);

router.post('/categories', authMiddleware, adminMiddleware, extraController.createCategory);
router.get('/categories', extraController.getCategories);

router.get('/admin/stats', authMiddleware, adminMiddleware, extraController.getAdminStats);

router.get('/users', authMiddleware, extraController.getAllUsers);
router.get('/messages/:userId', authMiddleware, extraController.getMessages);
router.post('/messages', authMiddleware, extraController.sendMessage);

router.get('/chat-contacts', authMiddleware, extraController.getChatContacts);
router.post('/ai-chat', authMiddleware, extraController.askAI);

module.exports = router;