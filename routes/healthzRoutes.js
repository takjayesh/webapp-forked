const express = require("express");
const asyncHandler = require("express-async-handler");
const db = require("../models");

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    await db.sequelize.authenticate();   // Simple query to check the connection
    res.status(200).set('Cache-Control', 'no-cache, no-store, must-revalidate').send('Database connection successful');
}));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(503).set('Cache-Control', 'no-cache, no-store, must-revalidate').send('Database connection failed');
});

module.exports = router;
