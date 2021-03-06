const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 3000;

//   var ExpressPeerServer = require("peer").ExpressPeerServer;    
// var options = {
//   debug: true,
//   allow_discovery: true,
// };

// const { ExpressPeerServer } = require("peer")
// const peerServer = ExpressPeerServer(server, {
//     debug: true
// })
// app.use("/peerjs", peerServer);

// let peerServer = ExpressPeerServer(server, options);
// app.use("/peerjs", peerServer);


app.set('view engine', 'ejs')

app.use(express.static('public'))

var router = express.Router(); // need to add 

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit("user-connected", userId)

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId)
    })
  })
})

// server.listen(3000)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
