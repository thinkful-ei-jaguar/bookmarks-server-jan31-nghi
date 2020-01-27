const {NODE_ENV} = require('./config');

module.exports = function(error, req, res, next) {
    let response;
    console.log(error);
    if(NODE_ENV === 'production') {
      response = { error: { message: 'server error' } };
    } else {
      console.error(error);
      response = { message: error.message, error };
    }
  
    res.status(500).json(response);
  };