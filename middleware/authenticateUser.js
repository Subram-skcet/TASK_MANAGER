const jwt = require('jsonwebtoken')
const CustomError = require('../errors')

const authenticateUser = async(req,res,next) =>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new CustomError.UnauthenticatedError('Unauthorized Try login again')
    }

    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userId:payload.UserId,name:payload.name}

        next()
    }
    catch(error){
        throw new CustomError.UnauthenticatedError('Unauthorized Try login again')
    }
}

module.exports = authenticateUser