/* eslint-disable no-console */
const Orders = require('../models/orders');
const { isObjectId, pagination } = require('../utils/utils');

// Get '/orders'
const getOrders = async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const listOrder = await Orders.paginate({}, options);
    const url = `${req.protocol}://${req.get('host') + req.path}`;
    const links = pagination(listOrder, url, options.page, options.limit, listOrder.totalPages);
    res.links(links);
    console.log(listOrder.docs);
    return res.status(200).json(listOrder.docs);
  } catch (err) {
    next(err);
  }
};

// Get '/orders/:orderId'
const getOneOrder = async (req, res, next) => {
  try {
    if (!isObjectId(req.params.orderId)) return next(404);

    const order = await Orders.findOne({ _id: req.params.orderId }).populate('products.product');

    if (!order) return next(404);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// Post '/orders'
const newOrder = async (req, res, next) => {
  const { client, products } = req.body;
  try {
    if (!client) return next(400);
    if (!products || products.lenght === 0) return next(400);

    // const foundOrder = await Orders.findOne({ folio: req.body.folio });

    // if (foundOrder) {
    //   return res.status(403).json({
    //     message: '(Error) La orden ya se encuentra registrada',
    //   });
    // }

    const newOrder = new Orders({
      userId: req.authToken.uid,
      client,
      products,
    });

    const orderSaved = await newOrder.save(newOrder);
    const orderPopulate = await Orders.findOne({ _id: orderSaved._id }).populate('products.product');
    return res.status(200).json(orderPopulate);
  } catch (err) {
    next(err);
  }
};

// Put '/orders/:orderId'
const updateOrder = async (req, res, next) => {
  const { orderId } = req.params;

  const {
    status,
  } = req.body;

  try {
    if (Object.keys(req.body).length === 0) return next(400);

    const statusOrder = [
      'pending',
      'preparing',
      'canceled',
      'delivering',
      'delivered',
    ];
    if (status && !statusOrder.includes(status)) return next(400);
    const now = Date();
    const dateChange = now.toString();

    const orderUpdated = await Orders.findOneAndUpdate(
      { _id: orderId },
      {
        $set: req.body,
        dateProcessed: dateChange,
      },
      { new: true, useFindAndModify: false },
    );
    return res.status(200).json(orderUpdated);
  } catch (err) {
    next(404);
  }
};

// Delete '/orders/:ordersId'
const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!isObjectId(orderId)) return next(404);

    // const foundOrder = await Orders.findOne({ _id: orderId });
    const foundOrder = await Orders.findByIdAndDelete({ _id: orderId });
    return res.status(200).json(foundOrder);
  } catch (err) {
    next(404);
  }
};

module.exports = {
  getOrders,
  newOrder,
  updateOrder,
  getOneOrder,
  deleteOrder,
};
