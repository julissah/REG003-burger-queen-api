/* eslint-disable no-console */
const Product = require('../models/product');
const { pagination } = require('../utils/utils');
const { isAdmin } = require('../middleware/auth');

// GET '/products'
const getProducts = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const allProducts = await Product.paginate({}, options);
    const url = `${req.protocol}://${req.get('host') + req.path}`;
    const links = pagination(allProducts, url, options.page, options.limit, allProducts.totalPages);
    res.links(links);
    return res.status(200).json(allProducts.docs);
  } catch (err) {
    next(err);
  }
  // // const productFind = Product.find({});
  // // const { limit } = req.query;
  // const url = `${req.protocol}://${req.get('host') + req.path}`;
  // const options = {
  //   page: parseInt(req.query.page, 10) || 1,
  //   limit: parseInt(req.query.limit, 10) || 10,
  // };
  // const productFind = Product.paginate({}, options);
  // productFind
  //   .then((doc) => {
  //     console.log(doc);
  //     if (!doc) {
  //       return next(404);
  //     }
  //     if (doc) {
  //       const links = pagination(doc, url, options.page, options.limit, doc.totalPages);
  //       res.links(links);
  //       return res.status(200).send(doc);
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
};

// GET 'products:id'
const getOneProducts = async (req, res, next) => {
  const { productId } = req.params;
  await Product.findById(productId, (err, productfound) => {
    if (err) return next(404);
    if (!productfound) return next(404);
    res.status(200).json(productfound);
  });
};

// POST '/products'

const newProduct = async (req, res, next) => {
  const { name, price } = req.body;
  try {
    if (!name || !price) return next(400);

    // const findProduct = await Product.findOne({ name: req.body.name });
    // if (findProduct) {
    //   return res.status(403).json({
    //     message: 'El producto ya se encuentra registrado',
    //   });
    // }

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
const updateProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    if (!productId) return next(400);
    if (!isAdmin(req)) return next(403);
    const findProduct = await Product.findOne({ _id: productId });
    if (!findProduct) return next(404);

    if (Object.entries(req.body).length === 0) return next(400);

    const productUpdate = await Product.findOneAndUpdate(
      productId,
      { $set: req.body },
      { new: true, useFindAndModify: false },
    );
    return res.status(200).send(productUpdate);
  } catch (err) {
    next(404);
  }
};

// Delete '/products/:productId'
const deleteOneProduct = async (req, res, next) => {
  const { productId } = req.params;

  if (!isAdmin(req)) return next(403);

  Product.findById(productId, (err, product) => {
    if (err) return next(404);
    product.remove((err) => {
      if (err) return next(500).send({ message: '' });
      res.status(200).send(product);
    });
  });
};

module.exports = {
  getProducts,
  getOneProducts,
  newProduct,
  deleteOneProduct,
  updateProduct,
};
