const express = require('express');
const router = express.Router();

// Placeholder email routes
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Email routes working' });
});

module.exports = router;