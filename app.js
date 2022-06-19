import UAuth from '@uauth/js'

const uauth = new UAuth(
//   clientID: "aa3d2d7a-38ee-49a4-89ba-a6fe5398e570",
// //   redirectUri: "http://localhost:3003",
//   redirectUri: 'http://localhost',
//   scope: "openid wallet email:optional humanity_check:optional"

{
    clientID: "1b41e195-7259-40cb-9cc6-128a7bf63b41",
    redirectUri: "http://localhost",
    scope: "openid wallet email:optional humanity_check:optional"
  }
)

window.login = async () => {
    try {
      const authorization = await uauth.loginWithPopup()
    console.log("SIGGGGGGGGGNNNNNNNNNNNNNNNNNEEEEEEEEEEEEEDDDDDDDDDD")
      console.log(authorization)
    } catch (error) {
      console.error(error)
      console.log("ISSSSSSSSSSSSSSSSSUUUUUUUUUUUUUUEEEEEEEEEEEEEEEE")
    }
  }