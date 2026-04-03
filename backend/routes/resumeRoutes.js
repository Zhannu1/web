const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, upload.single('avatar'), resumeController.createResume);
router.get('/', resumeController.getResumes);
router.get('/:id', resumeController.getResumeById);
router.put('/:id', authMiddleware, upload.single('avatar'), resumeController.updateResume);
router.delete('/:id', authMiddleware, resumeController.deleteResume);

module.exports = router;