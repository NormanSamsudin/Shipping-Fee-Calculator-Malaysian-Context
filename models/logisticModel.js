const mongoose = require('mongoose');

const logisticSchema = new mongoose.Schema({
  origin_country: {
    type: String,
    required: [true, 'Postcode from must have a value']
  },
  origin_state: {
    type: String,
    required: [true, 'Postcode to must have a value']
  },
  origin_postcode: {
    type: Number,
    required: [true, 'Shipping type must have a value']
  },
  destination_country: {
    type: String,
    required: [true, 'destination_country must have a value']
  },
  destination_state: {
    type: String,
    required: [true, 'destination_state must have a value']
  },
  destination_postcode: {
    type: Number,
    required: [true, 'destination_postcode must have a value']
  },
  length: {
    type: Number,
    required: [true, 'length must have a value']
  },
  width: {
    type: Number,
    required: [true, 'Item width must have a value']
  },
  height: {
    type: Number,
    required: [true, 'Item height must have a value']
  },
  selected_type: {
    type: Number,
    required: [true, 'Item selected_type must have a value']
  },
  parcel_weight: {
    type: Number,
    required: [true, 'Item parcel_weight must have a value']
  },
  shipping_rates_type: {
    type: String,
    required: [true, 'Item shipping_rates_type must have a value']
  },
  sender_postcode: {
    type: Number,
    required: [true, 'Item sender_postcode must have a value']
  },
  receiver_postcode: {
    type: Number,
    required: [true, 'Item receiver_postcode must have a value']
  },
  shipping_type: {
    type: String,
    required: [true, 'Item shipping_type must have a value']
  },
  weight: {
    type: Number,
    required: [true, 'Item weight must have a value']
  },
  jnt: {
    type: Number,
    required: [true, 'Jnt must have a value']
  },
  city_link: {
    type: Number,
    required: [true, 'City-link weight must have a value']
  }
});

// create model based on schema
const Logistic = mongoose.model('Logistic', logisticSchema);

module.exports = Logistic;
