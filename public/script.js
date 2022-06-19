// import UAuth from '@uauth/js'


// import {Client} from '@uauth/node'
// import Resolution from '@unstoppabledomains/resolution'
// import express from 'express'
// import 'express-async-errors'
// import session from 'express-session'
// import morgan from 'morgan'
// import 'whatwg-fetch'
// // ;(global as any).XMLHttpRequest = require('xhr2') as any
// // ;(global as any).XMLHttpRequestUpload = (
// //   (global as any).XMLHttpRequest as any
// // ).XMLHttpRequestUpload

// const resolution = new Resolution()

// const client = new Client({
//   clientID: '1421c29a-cf20-4a5c-a6fa-65fbcc8c6151',
//   redirectUri: 'http://localhost:5000',
//   resolution,
// })

// const app = express()

// app.use(morgan('dev'))

// app.get('/', (_, res) => {
//   const indexPage = `<!DOCTYPE html><html><body>
// <form action="/login" method="POST">
//   <input name="login_hint" id="login_hint" />
//   <button type="submit">Login</button>
// </form></body></html>`

//   return res.send(indexPage)
// })

// // Required for express session middleware
// app.use(session({secret: 'keyboard cat'}))

// // Required for /login & /callback
// app.use(express.urlencoded({extended: true}))

// const {login, callback, middleware} = client.createExpressSessionLogin()

// app.post('/login', (req, res, next) => {
//   return login(req, res, next, {
//     username: req.body.login_hint,
//   })
// })

// app.post('/callback', async (req, res, next) => {
//   console.log('Calling back!')

//   await callback(req, res, next)

//   return res.redirect('/profile')
// })

// const onlyAuthorized = middleware()

// app.get('/profile', onlyAuthorized, async (req, res) => {
//   res.json(res.locals.uauth)
// })

// app.listen(5000, () => {
//   console.log('Listening at http://localhost:5000')
// })

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3002'
})
// const myPeer = new Peer( {
//   secure:true,
//   host: "web3-video-call-peer-server.herokuapp.com",
//   port: 443,
//   // path: "/peerjs",
// })

// const uauth = new UAuth({
//   // clientID: 'uauth_example_spa_id',
//   // redirectUri: 'http://localhost:5000/callback',
//     clientID: "aa3d2d7a-38ee-49a4-89ba-a6fe5398e570",
//     redirectUri: 'http://localhost',
//     scope: "openid wallet email:optional humanity_check:optional"

// })


// window.login = async () => {
//   try {
//     const authorization = await uauth.loginWithPopup()
 
//     console.log(authorization)
//   } catch (error) {
//     console.error(error)
//   }
// }


var getUserMedia = 
navigator.getUserMedia || 
navigator.webkitGetUserMedia || 
navigator.mozGetUserMedia;

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })


  myPeer.on("call", function(call){
    getUserMedia({
          video:true,
          audio:true
    
      }, function(stream){
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", function (remoteStream) {
          addVideoStream(video, remoteStream);
        });
      }, function(err){
          console.log(err);
      })
    })



  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}