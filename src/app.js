import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
app.get("/", (req, res) => {
  res.send("Hello World!");
})

// study cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({
    limit: "50kb"
}))

app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())


//routes import

import userRouter from './routes/user.route.js'

//routes declared
app.use("/api/v1/users", userRouter);


export {app}