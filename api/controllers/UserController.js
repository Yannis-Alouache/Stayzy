const express = require('express');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

class UserController {
  constructor() {
    this.router = express.Router();
    this.router.get('/profile', this.profile.bind(this));
  }

  async profile(req, res) {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err;
        const { name, email, _id } = await User.findById(userData.id);
        res.json({ name, email, _id });
      });
    } else {
      res.json(null);
    }
  }
  // Add user-related methods here
}

module.exports = UserController;
