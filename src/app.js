//Configure create variables written in .env file to the environment
require('dotenv').config();
//imports Express 
const express = require('express');
//Enable middleware functions
const morgan = require('morgan');
//Enable Cross Origin Resource Sharing, simplifies the config of CORS in Express
const cors = require('cors');
//does the security hiding for us
const helmet = require('helmet');
//imports environment from config settings
const { NODE_ENV } = require('./config');

const app = express();

// Depends on the condition of the environment
// Morgan - tiny format for production environment
// Morgan - common format for development environment
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

  // Mounting our middleware, always put helmet before cors!
app.use(morgan(morganOption)); 
app.use(helmet());
app.use(cors());


app.get('/', (req, res) => {
  res.json( { message: 'Hello World' } );
});

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


module.exports = app;