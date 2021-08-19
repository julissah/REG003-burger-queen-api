/* eslint-disable no-console */
const Orders = require('../models/orders');

// Get '/orders'
const getOrders = (req, res, next) => {
  const userFind = Orders.find({});
  userFind
    .then((doc) => {
      if (!doc) {
        return next(404);
      }
      console.log(doc);
      if (doc.length === 0) return res.send({ message: 'no existen ordenes para lista' });
      if (doc) {
        return res.status(200).send(doc);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get '/orders/:orderId'
const getOneOrder = async (req, res, next) => {
  const orderid = req.params.uid;
  await Orders.findById(orderid, (err, orderfound) => {
    if (err) return next(404);
    // if (!userfound) return res.status(404).send({ message: 'El usuario no ha sido encontrado' });
    res.status(200).send(orderfound);
  });
};

// Post '/orders'
const newOrder = async (req, res, next) => {
  console.log('esto esta llegando');
  console.log(req.body);

  try {
    const { folio, userId, client } = req.body;
    if (!folio) {
      return next(400);
    }
    // if (!products || products.lenght === 0) return next(400);

    const foundOrder = await Orders.findOne({ folio: req.body.folio });

    if (foundOrder) {
      return res.status(403).json({
        message: '(Error) La orden ya se encuentra registrada',
      });
    }
    const newOrder = new Orders({
      folio,
      userId,
      client,
      products: [{
        qty: 1,
        products: 'aca van los productos',
      }],
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

module.exports = {
  getOrders,
  newOrder,
  updateOrder,
  getOneOrder,
};
