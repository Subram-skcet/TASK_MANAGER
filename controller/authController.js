const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {
    RegistrationMail,
    forgetPassMail
} = require('../utils')
const CustomError = require('../errors')
const crypto = require('crypto')


const login = async(req,res) =>{
    const {email,password} = req.body
    if(!password || !email){
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    
    const user = await User.findOne({email})

    if(!user ){
        throw new CustomError.UnauthenticatedError("Account not yet Registered")
    }

    if(!user.isRegistered){
        const RegisterToken = crypto.randomBytes(40).toString('hex')
        user.RegisterToken=RegisterToken
        await user.save()
        const origin = 'http://localhost:3000'
        await RegistrationMail(
            {
                name:user.name,
                email,
                token:RegisterToken,
                origin
            }
        )
        throw new CustomError.UnauthenticatedError("Registration process not yet completed. Check your email to complete it")
    }


    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }

    const token = user.createJWT()
    
    res.status(StatusCodes.OK).json({msg:'Logged in successfully',token})
}

const register = async(req,res) =>{
    const {name,email,password} = req.body

    const RegisterToken = crypto.randomBytes(40).toString('hex')

    const user = await User.create({
        name,
        email,
        RegisterToken,
        password
    })

    const token = user.createJWT()
    
    const origin = 'http://localhost:3000'
    await RegistrationMail(
        {
            name,
            email,
            token:RegisterToken,
            origin
        }
    )
       res.status(StatusCodes.OK).json({msg:'Check Mail',token})
}

const resendMail = async(req,res)=>{
    const {name,email} = req.query
    const user = await User.findOne({email})
    const RegisterToken = crypto.randomBytes(40).toString('hex')
    user.RegisterToken=RegisterToken
    await user.save()
    
    const origin = 'http://localhost:3000'
    await RegistrationMail(
        {
            name,
            email,
            token:RegisterToken,
            origin
        }
    )
    res.status(StatusCodes.OK).json({msg:'Mail Sent. Check your inbox'})
}
const forgetMail = async(req,res)=>{
    const {email} = req.body

    const EmailToken = crypto.randomBytes(40).toString('hex')

    const user = await User.findOne({email})
    
    if(!user){
        throw new CustomError.BadRequestError('This mail is not yet registered')
    }
    user.EmailToken = EmailToken
    await user.save()

    const origin = 'http://localhost:3000'
    await forgetPassMail(
        {
            name:user.name,
            email,
            token:EmailToken,
            origin
        }
    )
    res.status(StatusCodes.OK).json({msg:'Mail Sent. Check your inbox'})
}
const updatePassword = async(req,res)=>{
    const {email,password,cnfrmpassword} = req.body

    if(password !== cnfrmpassword){
        throw new CustomError.BadRequestError('Password must be similar in two fields')
    }
    
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError('Verification failed')
    }
    user.password = password
    await user.save()

    res.status(StatusCodes.OK).redirect('/main.html')
}
const ResetPasswd = async(req,res) =>{
    const {email,token} = req.query
        
     const user = await User.findOne({email})
    if(user.EmailToken !== token){
        throw new CustomError.UnauthenticatedError('Verification failed')
    }
    res.status(StatusCodes.OK).redirect('/forgetpwd.html')
}
const registerAuth = async(req,res) =>{

    const {token,email} = req.query
  

    const user = await User.findOne({email})

    if(!user){
        throw new CustomError.UnauthenticatedError('Verification failed')
    }

    if(user.RegisterToken !== token){
        console.log(user.RegisterToken,token);
        throw new CustomError.UnauthenticatedError('Verification failed')
    }

    user.isRegistered = true;
    await user.save();
    res.status(StatusCodes.OK).redirect('/main.html')
    
}

module.exports = {
    login,
    register,
    registerAuth,
    resendMail,
    forgetMail,
    ResetPasswd,
    updatePassword
}