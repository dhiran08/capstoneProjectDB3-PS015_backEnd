const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  name: String,
  location: String,
  description: String,
  image: String,
  phone: String,
  price: Number
});

module.exports = mongoose.model('Destination', destinationSchema);