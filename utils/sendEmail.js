const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodeMailerConfig')


const sendEmail = ({to,subject,html}) =>{

    const transporter = nodemailer.createTransport(nodemailerConfig)
    return transporter.sendMail(
        {
            from:'TASK_MANAGER@admin <subram_official@gmail.com>',
            to,
            subject,
            html
        }
    )
}

module.exports = sendEmail