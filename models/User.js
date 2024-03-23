const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Please provide username'],
            minLength:[3,'Name should contains atleast 3 characters'],
            maxLength:[20,'Name should not be more than 20 characters']
        },
        email:{
            type:String,
            unique:true,
            validate:{
                validator: validator.isEmail,
                message:'Please provide a valid email'
            },
            required:[true,'Please provide a email']
        },
        password:{
            type:String,
            required:[true,'Please provide a password'],
            minLength:[5,'Password should contain atleast 5 letters'],
        },
        isRegistered:Boolean,
        RegisterToken:String,
        EmailToken:String
    }
)

UserSchema.pre('save',async function(){
    if(!this.isModified('password'))
        return
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)

})

UserSchema.methods.createJWT = function(){
    const token = jwt.sign({UserId:this._id,name:this._name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    return token
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password)

    return isMatch
}

module.exports = mongoose.model('User',UserSchema)