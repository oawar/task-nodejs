const express = require("express");
const { login } = require("../controllers/authController");
const router = express.Router();


// /api/auth/login
router.post("/login", login);

module.exports = router;
