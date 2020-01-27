//Configure create variables written in .env file to the environment
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const bookmarkRouter = require('./bookmarkRoute');
const winston = require('winston');
const logger = require('./logger');
const validateToken = require('./validateToken');
const errorHandling = require('./errorHandling');


const app = express();

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// Mounting our middleware, always put helmet before cors!
app.use(morgan(morganOption)); 
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(errorHandling);
app.use(validateToken);


// Routes
app.use(bookmarkRouter);
app.get('/', (req, res) => {
  res.json( { message: 'Hello World' } );
});


module.exports = app;