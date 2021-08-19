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
  try {
    const { name, price } = req.body;
    if (!name || !price) return next(404);

    const findProduct = await Product.findOne({ name: req.body.name });
    if (findProduct) {
      return res.status(403).json({
        message: '(Error) El producto ya se encuentra registrado',
      });
    }

    const newProduct = new Product(req.body);
    // eslint-disable-next-line no-console
    console.log(newProduct);
    const productSaved = await newProduct.save();
    res.status(200).json(productSaved);
    res.send('recibido');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  newProduct,
};
