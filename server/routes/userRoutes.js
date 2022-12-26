const express = require('express');

const { register, login, getUser } = require('../controllers/userController');

const protect = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post("/register", register);
router.post("/login" , login);
router.get("/getuser", protect, getUser);



module.exports = router;