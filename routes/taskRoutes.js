const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authenticateUser')

const {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} = require('../controller/taskController')

router
   .route('/')
   .get(authenticateUser,getAllTasks)
   .post(authenticateUser,createTask)

router
   .route('/:id')
   .get(getTask)
   .patch(authenticateUser,updateTask)
   .delete(authenticateUser,deleteTask)

module.exports = router