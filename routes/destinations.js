const Destination = require('../models/destination');
const destinationSchema = require('../schemas/destination');
const wrapAsync = require('../utils/wrapAsync');
const ErrorHandler = require('../utils/ErrorHandler');
const express = require('express');
const isValidObjectId = require('../middlewares/idValidObjectId');


const router = express.Router();

const validateDestination = (req, res, next) => {
  const { error } = destinationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
}

router.get('/', wrapAsync(async (req, res) => {
  const destinations = await Destination.find();
  res.render('destinations/index', { destinations });
  // res.send(destinations);
}))

router.get('/create', (req, res) => {
  res.render('destinations/create');
})

router.post('/', validateDestination, wrapAsync(async (req, res, next) => {
  const destination = new Destination(req.body.destination);
  await destination.save();
  req.flash('success_msg', 'Successfully add a new destination!');
  res.redirect(`/destinations`);
}))

router.get('/:id', isValidObjectId('/destinations'), wrapAsync(async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findById(id).populate('reviews');
  res.render('destinations/show', { destination });
}))

router.get('/:id/edit', isValidObjectId('/destinations'), wrapAsync(async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findById(id);
  res.render('destinations/edit', { destination });
}))

router.put('/:id', isValidObjectId('/destinations'), validateDestination, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndUpdate(id, { ...req.body.destination })
  req.flash('success_msg', 'Successfully update destination!');
  res.redirect(`/destinations/${id}`);
}))

router.delete('/:id', isValidObjectId('/destinations'), wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  req.flash('success_msg', 'Successfully delete destination!');
  res.redirect('/destinations');
}))

module.exports = router;