const express = require('express');
const bookmarkRouter = express.Router();
const uuid = require('uuid/v4');
const { bookmarks } = require('./store');
const logger = require('./logger');

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
      .json(bookmarks)
  })
  .post((req, res) => {
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
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
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
  })
  .delete((req, res) => {
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
  });

  module.exports = bookmarkRouter;