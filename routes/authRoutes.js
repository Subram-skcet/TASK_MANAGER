const express = require('express')
const router = express.Router()

const {login,register,registerAuth,resendMail,ResetPasswd,forgetMail, updatePassword} = require('../controller/authController')

router
    .route('/login')
    .post(login)

router
    .route('/register')
    .post(register)

router
    .route('/register-auth')
    .get(registerAuth)

router
    .route('/resend-email')
    .post(resendMail)

router
    .route('/reset-pwd')
    .get(ResetPasswd)

router
    .route('/forget-pwd')
    .post(forgetMail)

router
    .route('/update-pwd')
    .post(updatePassword)
module.exports = router