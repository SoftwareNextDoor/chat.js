require('../app/app');

var should = require('should'),
  request = require('request'),
  uri = 'http://localhost:3000';

describe('User authentication', function(){

  it('should set up a cookie if user is newbie', function(done){
    request.get(uri , function(error, response, body){
      should.not.exist(error);
      should.exist( response.headers['set-cookie'] );
      done();
    })
  });

  it('should detect returning users by their cookie', function(done){
    var cookieJar = request.jar()
      .add(request.cookie("identifier=908036d0-6535-11e2-bd14-4dd0af8e3e14"));

    request({ uri: uri, jar: cookieJar }, function(error, response, body){
      should.not.exist(response.headers['set-cookie']);
      done();
    })
  });

});
