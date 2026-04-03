const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware, employerMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.get('/me', authMiddleware, profileController.getMe);
router.put('/account', authMiddleware, profileController.updateAccount);
router.post('/company', authMiddleware, employerMiddleware, upload.single('logo'), profileController.createOrUpdateCompany);

router.post('/resume', authMiddleware, upload.single('avatar'), profileController.createOrUpdateResume);

module.exports = router;