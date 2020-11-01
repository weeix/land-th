const cors = require('cors');
const express = require('express');

const apiV1 = require('./routes/api_v1');
const sequelize = require('./sequelize');

const RETRY_TIMEOUT = 10000;
const EXPRESS_PORT = 5000;

const createApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database.');
    await sequelize.sync();
    console.log('Synced database tables.');

    // create express app
    const app = express();
    const corsOptions = {
      origin: true,
      credentials: true
    };
    app.use(cors(corsOptions));

    // routes
    app.use('/api/v1', apiV1);

    app.listen(EXPRESS_PORT, () => {
      console.log('Listening to port ' + EXPRESS_PORT);
    });

    return app;
  
  } catch (error) {
    setTimeout(createApp, RETRY_TIMEOUT);
    console.log(
      'Can not connect to the database. Retrying in ' + RETRY_TIMEOUT/1000 + 's'
    );
    return;
  }
}

const app = createApp();

module.exports = app;
