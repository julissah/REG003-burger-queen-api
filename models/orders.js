/* eslint-disable no-console */
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
      type: Schema.Types.ObjectId,
      ref: 'Product',
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
    type: String,
  },
});
OrdersSchema.plugin(mongoosePaginate);
module.exports = model('Orders', OrdersSchema);
