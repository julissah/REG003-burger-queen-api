const Product = require('../models/product');
const { pagination } = require('../utils/utils');

// GET '/products'
const getProducts = (req, res, next) => {
  // const productFind = Product.find({});
  // const { limit } = req.query;
  const url = `${req.protocol}://${req.get('host') + req.path}`;
  const options = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
  };
  const productFind = Product.paginate({}, options);
  productFind
    .then((doc) => {
      if (!doc) {
        return next(404);
      }
      if (doc) {
        const links = pagination(doc, url, options.page, options.limit, doc.totalPages);
        res.links(links);
        return res.status(200).send(doc);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// GET 'products:id'
const getOneProducts = async (req, res, next) => {
  const productId = req.params.productId;
  await Product.findById(productId, (err, productfound) => {
    if (err) return next(500);
    if (!productfound) return next(404).send({ message: 'El producto no existe' });
    res.status(200).send(productfound);
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
        message: 'El producto ya se encuentra registrado',
      });
    }

    const newProduct = new Product(req.body);
    // eslint-disable-next-line no-console
    console.log(newProduct);
    const productSaved = await newProduct.save();
    return res.status(200).json(productSaved);
  } catch (err) {
    next(err);
  }
};

// PUT '/products/:productId'
// const updateProduct = async (req, res, next) => {
//   try {
//     const { productId } = req.param;
//     const { body } = req;

//     const product = await Product.findOne()
//   }
// }

const deleteOneProduct = async (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if (err) return next(500);
    product.remove(err => {
      if (err) return next(500);
      res.status(200).send(product);
    });
  });
};
module.exports = {
  getProducts,
  getOneProducts,
  newProduct,
  deleteOneProduct,
};
