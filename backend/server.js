import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"

dotenv.config()


const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

app.use("/api/users/",userRoutes)
app.use("/api/auth/",authRoutes)

app.listen(port, () => console.log(`listening on port:`, port))

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
       console.log('conected to database')
    })
    .catch((err)=>console.log(err))
