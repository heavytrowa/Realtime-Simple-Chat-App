const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }


app.get('/', (req, res ) => {
  res.render('index' , {rooms:rooms});
})
app.get('/:room', (req, res) => {
  res.render('room' , {roomname:req.param.rooms});
})

server.listen(3000);
const users = {}//like a hashmap
//this is like for other people who connected to this page
io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)//send message to everyone to other people in the server except yourself
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })//when we see messages, we see the name who sent it and the message
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})