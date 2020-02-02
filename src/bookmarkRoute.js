const express = require('express');
// Use express.router class to create modular route handlers
// Similar to a mini app
const bookmarkRouter = express.Router();
const logger = require('./logger');
const BookmarkService = require('./bookmark-service');
const jsonParser = express.json();

bookmarkRouter
  .route('/')
  .get((req, res) => {
    BookmarkService
      .getBookmarks(req.app.get('db'))
      .then(bookmarks => res.json(bookmarks));
  })
  .post(jsonParser, (req, res, next) => {
    const { title, url, description = '', rating } = req.body; 
  
    if( !title || !url || !rating ) {
      logger.error('Title, Url and Rating are required');
      return res
      .status(400)
      .send('Invalid data');
    }
  
    const newBookmark = {
      title,
      url,
      description,
      rating
    };
  
    logger.info( `Bookmark with id ${id} created`);
    
    BookmarkService
      .addBookmark(res.app.get('db'), newBookmark)
      .then(newlyAdded => 
        res
        .status(201)
        .location(`/bookmarks/${id}`)
        .json(newlyAdded))
      .catch(next);
  });

bookmarkRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params; //this is the user id 
    BookmarkService
      .getByID(req.app.get('db'), id)
      .then(foundItem => res.json(foundItem));
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