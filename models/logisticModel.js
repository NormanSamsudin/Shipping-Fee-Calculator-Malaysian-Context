const mongoose = require('mongoose');

const logisticSchema = new mongoose.Schema({
  postcodeFrom: {
    type: Number,
    required: [true, 'Postcode from must have a value']
  },
  postcodeTo: {
    type: Number,
    required: [true, 'Postcode to must have a value']
  },
  shippingType: {
    type: String,
    enum: ['Regular', 'Next Day Delivery', 'Multi Piece Shipment'],
    required: [true, 'Shipping type must have a value']
  },
  weight: {
    type: Number,
    required: [true, 'Weight must have a value']
  },
  length: {
    type: Number,
    required: [true, 'Length must have a value']
  },
  width: {
    type: Number,
    required: [true, 'Width must have a value']
  },
  height: {
    type: Number,
    required: [true, 'Height must have a value']
  },
  itemInsurace: {
    type: Number,
    required: [true, 'Item insurance must have a value']
  }
});

// create model based on schema
const Logistic = mongoose.model('Logistic', logisticSchema);

module.exports = Logistic;
