io = require('socket.io').listen(8080)
uuid = require('node-uuid')

module.exports = (app) ->
  io.sockets.on 'connection', (socket) ->
    socket.emit 'user.uid'

    socket.on 'user.uid=', (uid) ->
      user = User.find(uid)
      if user?
        user.activate()
        user.save()
        socket.set 'uid', user.uid
        socket.emit 'user.create',
          name: user.name
          uid: user.uid
      else
        socket.emit 'user.name'
      return

    socket.on 'user.name=', (name) ->
      user = new User(name)
      user.save()
      socket.set 'uid', user.uid
      socket.emit 'user.create',
        name: user.name
        uid: user.uid
      return

    socket.on 'user.speak', (msg) ->
      socket.broadcast.emit 'user.speak', msg

    socket.on 'disconnect', ->
      socket.get 'uid', (err, uid) ->
        user = User.find uid
        if user?
          user.deactivate()
