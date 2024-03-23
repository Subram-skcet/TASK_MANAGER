require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const port = process.env.PORT || 3000
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middleware/error_handler')
const authRouter = require('./routes/authRoutes')
const taskRouter = require('./routes/taskRoutes')

//additional security packages
const helmet = require('helmet')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')

//middleware
app.set('trust proxy',1)
app.use(rateLimiter({
    windowMs:15*60*1000,
    max:100,
}))
app.use(express.static('./public'))
app.use(express.json())
app.use(helmet())
app.use(cors())


//routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/tasks',taskRouter)
app.use('*',(req,res)=>{
    res.redirect('404.html')
})
//errors
app.use(errorHandlerMiddleware)

const start = async() =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{console.log(`Server is listening on port ${port}`);})
    } catch (error) {
        console.log(error);
    }
}
start()
