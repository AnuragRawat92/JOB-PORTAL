//imports
import swaggerui from "swagger-ui-express";
import swaggerdoc from "swagger-jsdoc";
// const express=require("express")
import express from "express";
import 'express-async-errors';
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
// security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongosanitize from "express-mongo-sanitize"
//file imports
import connectdb from "./config/db.js";
import testroutes from  "./routes/testroute.js";
import authRoutes from "./routes/authRoutes.js"
import errorMiddleware from "./middlewares/errorMiddlewares.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobsRoutes.js"
//dotenv config
dotenv.config()
// config swagger api
const options ={
    definition:{
    openapi:"3.0.0",
    info:{
        title:"Job Portal Application",
        description:"NodeJs ExpressJs Job Portal Application"
    },
    servers:[
        {
            url:"http://localhost:8080/api-doc",
            url:"https://job-portal-awyz.onrender.com/api-doc"
        }
    ],
   components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
},
apis:['./routes/*.js']
    
}
const spec =swaggerdoc(options)
//mongodb connection
connectdb();
//rest objects
const app=express();
// middlewares
// app.use(helmet(``))
app.use(xss())
app.use(mongosanitize())
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
const PORT=8080 || process.env.PORT
//routes
app.use('/api/v1/test',testroutes)
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/job',jobRoutes)
app.use('/api-doc',swaggerui.serve,swaggerui.setup(spec))
// validator middleware
app.use(errorMiddleware)
// app.get('/',(req,res)=>{
//     res.redirect('/api-doc')
// })
//listen
app.listen(PORT,()=>{
    console.log(`server running in ${process.env.Dev_Mode} at ${PORT}`.bgCyan.white)
})
