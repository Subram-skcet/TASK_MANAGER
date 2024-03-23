const mongoose  = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Please provide task name']
        },
        completed:{
            type:Boolean,
            default:false
        },
        createdBy:{
            type:mongoose.Types.ObjectId,
            required:true
        }
    }
)

module.exports = mongoose.model('Task',TaskSchema)