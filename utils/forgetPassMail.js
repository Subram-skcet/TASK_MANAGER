const sendEmail = require('./sendEmail')

const forgetPassMail = ({name,email,token,origin}) =>{

    const registerURL=`${origin}/api/v1/auth/reset-pwd?token=${token}&email=${email}`;
    const message = 
    `
      <p>Welcome to <h5>TASK MANAGER</h5></p>
      <p>Click the below Reset button to reset the password, Thank You</p>
      <a href=${registerURL}>RESET</a>
      `
     return sendEmail({
         to:email,
         subject:'Resetting password',
         html:
         `
            <p>Hello ${name}</p>
            ${message}
         `
     }
     )
}

module.exports = forgetPassMail