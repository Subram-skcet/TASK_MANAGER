const sendEmail = require('./sendEmail')

const RegistrationMail = ({name,email,token,origin}) =>{

    const registerURL=`${origin}/api/v1/auth/register-auth?token=${token}&email=${email}`;
    const message = 
    `
      <p>Welcome to <h5>TASK MANAGER</h5></p>
      <p>Click the below register button to complete the registration process, Thank You</p>
      <a href=${registerURL}>REGISTER</a>
      `
     return sendEmail({
         to:email,
         subject:'Completing Registration process',
         html:
         `
            <p>Hello ${name}</p>
            ${message}
         `
     }
     )
}

module.exports = RegistrationMail