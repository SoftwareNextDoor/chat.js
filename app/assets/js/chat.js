var App = Ember.Application.create()

App.ChatRouterBase = Em.Route.extend({
  redirect: function(){
    var nickname = null;

    if (!App.has_nickname())
      nickname = 'Gallo'
      while(nickname==='' || nickname===null){
        nickname = prompt('Pick your nickname');
      }
      App.nickname = nickname;
      this.controllerFor('users').pushObject({nickname: nickname});
  }
});

App.IndexRoute = App.ChatRouterBase.extend({
  renderTemplate: function(){
    var boardController = this.controllerFor('board');
    var usersController = this.controllerFor('users');

    this.render('board', {
      controller: boardController,
      outlet: 'board'
    });

    this.render('user-list', {
      controller: usersController,
      outlet: 'userlist',
      into: 'board'
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

App.UsersController = Em.ArrayController.extend({
  content: Em.A()
});

var Message = Em.Object.extend({
  body: '',
  nicknameBinding: 'App.nickname'
})


// helper methods

App.has_nickname = function(){
  return  App.nickname !== undefined
}
