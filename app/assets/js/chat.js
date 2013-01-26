var App = Ember.Application.create()

App.IndexRoute = Em.Route.extend({
  renderTemplate: function(){
    var boardController = this.controllerFor('board');
    var usersController = this.controllerFor('users');
    var userController = this.controllerFor('user');

    this.render('board', {
      controller: boardController,
      outlet: 'board'
    });

    this.render('user-list', {
      controller: usersController,
      outlet: 'userlist',
      into: 'board'
    });
    
    $.get('/user', function (response, textStatus) {
      userController.set('content' , response);
      usersController.pushObject(userController);
    }); 
  }
});

App.MessageInputView = Em.TextField.extend({
  reset: function(){
    this.set('value', '');
  },

  keyUp: function(e){
    if ( this.get('value') !== '' && e.keyCode === 13 ){
      var msg = Message.create({body: this.get('value')});
      this.get('controller').addMessage( msg );
      this.reset();
    }
  }
});

App.BoardController = Ember.ArrayController.extend({
  needs: ['users'],

  content: Em.A(),

  addMessage: function( msg ){
    this.content.pushObject( msg );
  }
});

App.UserController = Em.ObjectController.extend({});

App.UsersController = Em.ArrayController.extend({
  content: Em.A()
});


var Message = Em.Object.extend({
  body: '',
  nicknameBinding: 'App.nickname'
})
