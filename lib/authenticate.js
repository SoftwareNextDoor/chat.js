var uuid = require('node-uuid'),
    cookie = require('cookie');

function hasCookies(request){
  return !!request.headers.cookie
}

function hasDesiredCookies(request) {
  return !!cookie.parse(request.headers.cookie)['identifier'];
}

var Authenticate = function( request, response, next){

  if (hasCookies(request) && hasDesiredCookies(request)) {
    // Retrieve nickname or something.
  } else {
    response.cookie('identifier', uuid.v1() );
  }

  next();
}

module.exports = function(req, res, next){
  Authenticate(req, res, next);
}
