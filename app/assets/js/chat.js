var App = Em.Application.create()
  , socket = io.connect();

App.ApplicationRoute = Em.Route.extend({
  setupController: function (controller) {
    var self = this;

    socket.on('user', function (user) {
      self.controllerFor('userInfo')
          .set('user', user);
    });

    socket.on('userList', function (users) {
      self.controllerFor('userList')
          .set('content', users);
    });

  }
});

App.UserInfoController = Em.Controller.extend({

  register: function (name) {
    if (name!=='') {
      socket.emit('setName', name);
      this.set('isEditing', false);
    }
  },

  isEditing: false,

  edit: function () {
    this.set('isEditing', true);
  },

  cancel: function () {
    socket.emit('getUser');
    this.set('isEditing', false);
  }

});

App.UserInfo = Em.View.extend({
  focusOut: function (e) {
    this.get('controller')
        .send('cancel');
  }
});


App.UserListController = Em.ArrayController.extend({});

/*var App = Em.Application.create()*/
  //, socket = io.connect();


//socket.on('userInfo', function (session) {
  //App.session = session;
//})

//App.Router.map(function () {
  //this.route('registration');
  //this.route('main');
//});

//App.IndexRoute = Em.Route.extend({
  //setupController: function(controller){
    //var appController = this.controllerFor('application');

    //// Keep track of user property
    //appController.addObserver('user', function (user) {
      //if (user === {} || user['nickname'] === '') {
        //this.transitionToRoute('registration');
      //} else {
        //this.transitionToRoute('main');
      //}
    //})

    //socket.on('user', function (userObject) {
      //appController.set('user', userObject);
    //});

  //}
//});

//App.RegistrationRoute = Em.Route.extend({
  //model: function () {
    //return this.controllerFor('application').get('user');
  //}
//});

//App.RegistrationController = Em.ObjectController.extend({

  //register: function () {
    //var nickname = this.get('nickname');
    //if (nickname ==='') {
      //console.log('isEmpty');
    //} else {
      //console.log(nickname);
      //this.transitionToRoute('main')
    //}
  //}

//});


//App.MainRoute = Em.Route.extend({
  //model: function () {
    //return this.controllerFor('application').get('user');
  //}
//});

//App.MainController = Em.ObjectController.extend({
/*}*/

//var App = Ember.Application.create()
  //, socket = io.connect();

//App.IndexRoute = Em.Route.extend({
  //renderTemplate: function(){
    //var boardController = this.controllerFor('board');
    //var usersController = this.controllerFor('users');
    //var userController = this.controllerFor('user');

    //this.render('board', {
      //controller: boardController,
      //outlet: 'board'
    //});

    //this.render('user-list', {
      //controller: usersController,
      //outlet: 'userlist',
      //into: 'board'
    //});

    //socket.on('userlist', function (list) {
      //console.log(list);
      ////usersController.pushObjects(list);
      //usersController.set('content', list);
    //})

  //}
//});

//App.MessageInputView = Em.TextField.extend({
  //reset: function(){
    //this.set('value', '');
  //},

  //keyUp: function(e){
    //if ( this.get('value') !== '' && e.keyCode === 13 ){
      //var msg = Message.create({body: this.get('value')});
      //this.get('controller').addMessage( msg );
      //this.reset();
    //}
  //}
//});

//App.BoardController = Ember.ArrayController.extend({
  //needs: ['users'],

  //content: Em.A(),

  //addMessage: function( msg ){
    //this.content.pushObject( msg );
  //}
//});

//App.UserController = Em.ObjectController.extend({});

//App.UsersController = Em.ArrayController.create();

//var Message = Em.Object.extend({
  //body: '',
  //nicknameBinding: 'App.nickname'
//})
