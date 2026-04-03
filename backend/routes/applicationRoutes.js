const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware, employerMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, applicationController.applyForJob);
router.get('/my-applications', authMiddleware, applicationController.getUserApplications);
router.get('/job/:jobId', authMiddleware, employerMiddleware, applicationController.getJobApplications);
router.put('/:id/status', authMiddleware, employerMiddleware, applicationController.updateApplicationStatus);
router.put('/:id', authMiddleware, employerMiddleware, applicationController.updateApplicationStatus);

module.exports = router;