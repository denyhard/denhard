const express = require('express');
const { register, login, setAdmin } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/:id/admin', setAdmin);

module.exports = router;
