const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, dbUrl, secret } = config;

const app = express();

// conexion a base de datos
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // eslint-disable-next-line no-console
  .then(console.log('Base de datos conectada'))
  .catch(console.error);

app.set('config', config);
app.set('pkg', pkg);

// middlewares
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Routes
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
