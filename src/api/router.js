const express = require('express');
const userRoutes = require('./user/router');
const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/user
 */
router.use('/user', userRoutes);

module.exports = router;
