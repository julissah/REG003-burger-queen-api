/* eslint-disable no-console */
const { mongoose, Schema, model } = require('mongoose');

const OrdersSchema = new Schema({
  folio: { type: Number, select: true },
  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: [{
    qty: {
      type: Number,
    },
    product: {
      type: Object,
    },
  }],
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
  dateProcessed: {
    type: Date,
  },
});

module.exports = model('Orders', OrdersSchema);
