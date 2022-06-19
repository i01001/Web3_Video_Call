import UAuth from '@uauth/js'

const uauth = new UAuth({
//   clientID: "aa3d2d7a-38ee-49a4-89ba-a6fe5398e570",
// //   redirectUri: "http://localhost:3003",
//   redirectUri: 'http://localhost',
//   scope: "openid wallet email:optional humanity_check:optional"

    clientID: "aa3d2d7a-38ee-49a4-89ba-a6fe5398e570",
  clientSecret: "5EU9KrNpQOQF2CVNqByP.0t2jq",
  clientAuthMethod: "client_secret_post",
    redirectUri: "http://localhost",
    scope: "openid wallet email:optional humanity_check:optional"

})

window.login = async () => {
    try {
      const authorization = await uauth.loginWithPopup()
   
      console.log(authorization)
    } catch (error) {
      console.error(error)
    }
  }