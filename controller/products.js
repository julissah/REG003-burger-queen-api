const Product = require('../models/product');

// GET '/products'
const getProducts = (req, res, next) => {
  const productFind = Product.find({});
  productFind
    .then((doc) => {
      if (!doc) {
        return next(404);
      }
      if (doc) {
        return res.status(200).send(doc);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// POST '/products'

const newProduct = async (req, res, next) => {
  // try {
  //   const { name, price } = req.body;
  //   if(!name || !price) {
  //     return next(404);
  //   }
  // } catch (err) {

  // };

  res.send('recibido');
  const newProduct = new Product(req.body);
  // eslint-disable-next-line no-console
  console.log(newProduct);
  // const productSaved = await newProduct.save();

  // return res.status(200).json(productSaved);
};

module.exports = {
  getProducts,
  newProduct,
};
