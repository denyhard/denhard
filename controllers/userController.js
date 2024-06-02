const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
    try {
        const { email, password, institusi } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({ email, password: hashedPassword, institusi, admin: false });
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ error: 'Login failed!' });
        }
        // console.log(user)
        var obj = { id: user.id }
        if (user.admin) {
            obj.admin = true
        }
        const token = jwt.sign(obj, 'your_secret_key', { expiresIn: '7d' });
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
};

const setAdmin = async (req, res) => {
    // if (!req.user.admin) {
    //     return res.status(403).send({ error: 'Access denied' });
    // }
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.admin = true;
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { email, password, institusi, admin } = req.body;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      if (email) user.email = email;
      if (institusi) user.institusi = institusi;
      if (admin !== undefined) user.admin = admin;
  
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      await user.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = {
    register,
    login,
    setAdmin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
