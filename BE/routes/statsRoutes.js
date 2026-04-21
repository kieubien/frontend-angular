const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController');

router.get('/api/public/stats', StatsController.getPublicStats);

module.exports = router;
