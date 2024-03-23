const Task = require('../models/Task')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')

const getAllTasks = async(req,res) =>{
    const {userId:id} = req.user
    const tasks = await Task.find({createdBy:id})

    res.status(StatusCodes.OK).json({tasks,count:tasks.length})
}

const getTask = async(req,res) =>{
    res.send('get Task')
}

const createTask = async(req,res) =>{
    const {userId:id} = req.user
    req.body.createdBy = id
    const task = await Task.create(req.body)

    res.status(StatusCodes.CREATED).json({task})
}

const updateTask = async(req,res) =>{
   const {
       body:{name,completed},
       params:{id:_id},
       user:{userId:createdBy}
   } = req

   if(!_id){
    throw CustomError.BadRequestError(`No task exists try creating one`)
   }
    if(!name || !completed){
        throw CustomError.BadRequestError('Please provide all values')
    }

    const task = await Task.findByIdAndUpdate({_id,createdBy},req.body,{new:true,runValidators:true})

    if(!task){
        throw new CustomError.NotFoundError(`No job with id ${_id}`)
    }
    
    res.status(StatusCodes.OK).json({msg:'Updated successfully'})
}

const deleteTask = async(req,res) =>{
    
    const _id = req.params.id
    const userId = req.user.userId

    const task = await Task.findByIdAndDelete({_id,createdBy:userId})

    if(!task){
      
       throw new CustomError.NotFoundError(`No job with id: ${_id}`)
    }
 
    res.status(StatusCodes.OK).json({msg:'Deleted successfully'})
}

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
}