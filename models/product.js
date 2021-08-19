const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: URL },
  type: { type: String },
  dateEntry: { type: Date, default: Date.now },
});

module.exports = model('Product', productSchema);
