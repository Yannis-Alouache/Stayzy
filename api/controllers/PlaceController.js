const express = require('express');
const jwt = require('jsonwebtoken');
const Place = require('../models/Place.js');
const Booking = require('../models/Booking.js');

class PlaceController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.createPlace.bind(this));
    this.router.get('/user-places', this.getUserPlaces.bind(this));
    this.router.get('/:id', this.getPlaceById.bind(this));
    this.router.delete('/:id', this.removePlace.bind(this));
    this.router.put('/', this.updatePlace.bind(this));
    this.router.get('/', this.getAllPlaces.bind(this));
  }

  async createPlace(req, res) {
    const { token } = req.cookies;
    const {
      title, address, addedPhotos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET);
      const placeDoc = await Place.create({
        owner: userData.id, price,
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests,
      });
      res.json(placeDoc);
    } catch (err) {
      console.error('Error creating place:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserPlaces(req, res) {
    const { token } = req.cookies;
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET);
      const { id } = userData;
      const places = await Place.find({ owner: id });
      res.json(places);
    } catch (err) {
      console.error('Error getting user places:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPlaceById(req, res) {
    const { id } = req.params;
    try {
      const place = await Place.findById(id);
      res.json(place);
    } catch (err) {
      console.error('Error getting place by ID:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePlace(req, res) {
    const { token } = req.cookies;
    const {
      title, address, addedPhotos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET);
      const placeDoc = await Place.findById(req.body.id);
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title, address, photos: addedPhotos, description,
          perks, extraInfo, checkIn, checkOut, maxGuests, price,
        });
        await placeDoc.save();
        res.json('ok');
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    } catch (err) {
      console.error('Error updating place:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllPlaces(req, res) {
    const { destination, arrival, departure, travelers } = req.query;
    let filters = {};
    if (destination) filters.address = { $regex: new RegExp(destination, 'i') };
    if (travelers) filters.maxGuests = { $gte: Number(travelers) };
    try {
      let places = await Place.find(filters);
      if (arrival && departure) {
        const arrivalDate = new Date(arrival);
        const departureDate = new Date(departure);
        const unavailablePlaceIds = await Booking.find({
          $or: [
            { checkIn: { $lt: departureDate }, checkOut: { $gt: arrivalDate } },
            { checkIn: { $gte: arrivalDate, $lt: departureDate } },
            { checkOut: { $gt: arrivalDate, $lte: departureDate } }
          ]
        }).distinct('place');
        
        for (const place of places) {
          for (const unavailablePlaceId of unavailablePlaceIds) {
            console.log(unavailablePlaceId.toString(), place._id.toString());
            if (place._id.toString() === unavailablePlaceId.toString()) {
              console.log(`Removing ${place.title} `);
              places.splice(places.indexOf(place), 1);
            }
          }
        }
      }
      res.json(places);
    } catch (err) {
      console.error('Error getting all places:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async removePlace(req, res) {
    const { token } = req.cookies;
    const { id } = req.params;
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET);
      const placeDoc = await Place.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        await placeDoc.remove();
        res.json('ok');
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    } catch (err) {
      console.error('Error removing place:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = PlaceController;
