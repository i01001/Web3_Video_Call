const socket = io('/')
const videoGrid = document.getElementById('video-grid')
// const myPeer = new Peer(undefined, {
//   host: '/',
//   port: '3002'
// })
const myPeer = new Peer( {
  secure:true,
  host: "web3-video-call-peer-server.herokuapp.com",
  port: 443,
  // path: "/peerjs",
})

// var peer = new Peer({
//   host: "yoursite.herokuapp.com",
//   port: "",
//   path: "/peerjs",
// });

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