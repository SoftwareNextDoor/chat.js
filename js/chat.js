var App = Ember.Application.create()


App.Router.map(function( match ){
  match('/').to('index');
});

App.ChatRouterBase = Em.Route.extend({
  redirect: function(){
    if (!App.has_nickname())
      App.nickname = prompt('Write your nickname');
  }
});

App.IndexRoute = App.ChatRouterBase.extend({
  renderTemplate: function(){
    var boardController = this.controllerFor('board');
    this.render('board', {
      controller: boardController,
      outlet: 'board'
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
  content: [],

  addMessage: function( msg ){
    this.content.pushObject( msg );
  }
});

var Message = Em.Object.extend({
  body: '',
  nickname: function(){
    return App.nickname
  }.property("App.nickname")
})


// helper methods

App.has_nickname = function(){
  return  App.nickname !== undefined
}
