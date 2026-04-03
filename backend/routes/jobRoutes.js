const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authMiddleware, employerMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', jobController.getJobs);

router.get('/my-jobs', authMiddleware, employerMiddleware, jobController.getMyJobs);

router.get('/:id', jobController.getJobById);

router.post('/', authMiddleware, employerMiddleware, upload.single('logo'), jobController.createJob);

module.exports = router;