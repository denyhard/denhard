const express = require('express');
const { register, login, setAdmin, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id/admin', setAdmin);

router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
