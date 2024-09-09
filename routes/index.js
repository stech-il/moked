
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Main route with authentication check
router.get('/', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/../public/checkin');
});

module.exports = router;
