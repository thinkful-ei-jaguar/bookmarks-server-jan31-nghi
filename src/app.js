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
app.use((error, req, res, next) => {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }

  res.status(500).json(response);
});

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})


// Routes
app.use(bookmarkRouter);

app.get('/', (req, res) => {
  res.json( { message: 'Hello World' } );
});


module.exports = app;