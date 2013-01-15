module.exports = (app) ->
  class app.User
    constructor: (@name) ->
      @online = true
      @uid = uuid.v1()

    @find: (uid) ->
      User.source[uid]

    save: ->
      User.source[@uid] = @
      User.hooks()

    activate: ->
      @online = true
      User.hooks()

    deactivate: ->
      @online = false
      User.hooks()

    @hooks: ->
      io.sockets.emit 'users.refresh', User.source

  User.source = {}