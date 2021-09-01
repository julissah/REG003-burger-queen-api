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
    return res.status(200).json(listOrder.docs);
  } catch (err) {
    next(err);
  }
};

// Get '/orders/:orderId'
const getOneOrder = async (req, res, next) => {
  const orderid = req.params.orderId;
  await Orders.findById(orderid, (err, orderfound) => {
    if (err) return next(404);
    // if (!userfound) return res.status(404).send({ message: 'El usuario no ha sido encontrado' });
    res.status(200).send(orderfound);
  });
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
    return res.status(200).json(orderSaved);
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
      'canceled',
      'delivering',
      'delivered',
    ];
    if (status && !statusOrder.includes(status)) return next(400);

    const orderUpdated = await Orders.findOneAndUpdate(
      { _id: orderId },
      { $set: req.body },
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

    // if (req.authToken.uid !== userDeleted._id.toString() && !isAdmin(req)) return next(403);

    const foundOrder = await Orders.findOne({ _id: orderId });
    await Orders.findByIdAndDelete({ _id: orderId });
    return res.status(200).send(foundOrder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  newOrder,
  updateOrder,
  getOneOrder,
  deleteOrder,
};
