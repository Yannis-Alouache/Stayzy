const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const express = require('express');

const bcryptSalt = bcrypt.genSaltSync(10);

class AuthController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.post('/logout', this.logout.bind(this));
  }

  async register(req, res) {
    const { name, email, password } = req.body;
    try {
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
    } catch (e) {
      res.status(422).json(e);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({ email: userDoc.email, id: userDoc._id }, process.env.JWT_SECRET, {}, (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
      } else {
        res.status(422).json('La connexion au serveur a échoué');
      }
    } else {
      res.status(422).json('La connexion au serveur a échoué');
    }
  }

  logout(req, res) {
    res.cookie('token', '').json(true);
  }
}

module.exports = AuthController;
