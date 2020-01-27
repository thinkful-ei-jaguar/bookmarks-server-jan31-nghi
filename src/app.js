//Configure create variables written in .env file to the environment
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const winston = require('winston');
const uuid = require('uuid/v4');
const { bookmarks } = require('./store');


const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

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


const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// Mounting our middleware, always put helmet before cors!
app.use(morgan(morganOption)); 
app.use(helmet());
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.json( { message: 'Hello World' } );
});

app.get('/bookmarks', (req, res) => {
  res
    .json(bookmarks)
});

app.get('/bookmarks/:id', (req, res) => {
  const { id } = req.params; //this is the users the id 
  const bookmark = bookmarks.find(b => b.id == id); 

  //make sure we found a bookmark
  if(!bookmark) {
    logger.error('Bookmark with id ${id} not found.');
    return res 
      .status(404)
      .send('Card Not Found');
  }
  res
    .json(bookmarks)
});

app.post('/bookmarks', (req, res) => {
  const { title, url, description = '', rating } = req.body; 

  if( !title || !url || !rating ) {
    logger.error('Title, Url and Rating are required');
    return res
    .status(400)
    .send('Invalid data');
  }
  const id = uuid();

  const bookmark = {
    id,
    title,
    url,
    description,
    rating
  };
  
  bookmarks.push(bookmark)

  logger.info( `Bookmark with id ${id} created`);

  res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${id}`)
    .json(bookmark);
})

app.delete('/bookmarks/:id', (req, res) => {
  const { id } = req.params;

  const index = bookmarks.findIndex(bookmark => bookmark.id == id);

  if(index === -1) { 
    logger.error(`List with id ${ id } not found.`);
    return res
      .status(404)
      .end();
  }

  bookmarks.splice(index, 1);

  logger.info(`List with id ${id} deleted.`);
  res
    .status(204)
    .end();
})









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