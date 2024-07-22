const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking.js');
const Place = require('../models/Place.js');


class BookingController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.createBooking.bind(this));
    this.router.delete('/:id', this.removeBooking.bind(this));
    this.router.get('/', this.getUserBookings.bind(this));
  }

  async getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    });
  }

  async isBookingConflict(placeId, checkIn, checkOut) {
    const existingBookings = await Booking.find({
      place: placeId,
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn }
        }
      ]
    });
  
    return existingBookings.length > 0;
  }


  async removeBooking(req, res) {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.json({ message: 'Booking removed successfully' });
  }

  async createBooking(req, res) {
    const userData = await this.getUserDataFromReq(req);
    const {
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price
    } = req.body;

    const { maxGuests } = await Place.findById(place);

    const phoneRegex = new RegExp(/^[+](\d{3})\)?(\d{3})(\d{5,6})$|^(\d{10,10})$/);

    if (!checkIn || !checkOut)
      return res.status(400).json({ error: 'Les dates de départ et d\'arrivé sont obligatoires' });
    if (numberOfGuests <= 0) 
      return res.status(400).json({ error: 'Le nombre d\'invité doit être supérieur à 0' });
    if (numberOfGuests > maxGuests)
      return res.status(400).json({ error: `Le nombre d\'invité doit être inférieur à ${maxGuests}` });
    if (!name)
      return res.status(400).json({ error: 'Le nom est obligatoire' });
    if (!phone)
      return res.status(400).json({ error: 'Le numéro de telephone est obligatoire' });
    if (phoneRegex.test(phone) === false) {
      return res.status(400).json({ error: 'Le numéro de telephone n\'est pas valide' });
    }

    const conflict = await this.isBookingConflict(place, checkIn, checkOut);
    if (conflict) {
      return res.status(400).json({ error: 'La période sélectionnée est déjà réservée.' });
    }

    Booking.create({
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
      user: userData.id,
    }).then((doc) => {
      res.json(doc);
    }).catch((err) => {
      throw err;
    });
  }

  async getUserBookings(req, res) {
    const userData = await this.getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'));
  }
}

module.exports = BookingController;
