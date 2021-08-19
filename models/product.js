const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  type: { type: String },
  dateEntry: { type: Date, default: Date.now },
});

productSchema.plugin(mongoosePaginate);
module.exports = model('Product', productSchema);
