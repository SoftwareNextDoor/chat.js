var App = Ember.Application.create()


App.Router.map(function( match ){
  match('/').to('index')
});

App.IndexRoute = Em.Route.extend({
  renderTemplate: function(){
    var boardController = this.controllerFor('board');
    this.render('board', {
      controller: boardController,
      outlet: 'board'
    });
  }
});


App.MessageInputView = Em.TextField.extend({
  clean: function(){
    this.set('value', '');
  },

  sendMessage: function( msg ){
    this.get('controller').addMessage( msg );
  },

  keyUp: function(e){
    if ( this.get('value') !== '' && e.keyCode === 13 ){
      this.sendMessage( this.get('value' ) );
      this.clean();
    }
  }
});

App.BoardController = Ember.ArrayController.extend({
  content: [],

  addMessage: function( msg ){
    this.content.pushObject( msg );
  }
});
