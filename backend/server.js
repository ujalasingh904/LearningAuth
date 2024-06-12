import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import cors from "cors"

dotenv.config()

mongoose
   .connect(process.env.MONGODB_URL)
   .then(() => {
      console.log('conected to database')
   })
   .catch((err) => console.log(err))

const app = express()
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port:`, port))
app.use(express.json())
// app.use(cors())

app.use("/api/users/", userRoutes)
app.use("/api/auth/", authRoutes)

app.use((err, req, res, next) => {
   const statusCode = err.statuscode || 501
   const message  = err.message || "Internal server error"
  
   return res.status(statusCode).json({
      success:false,
      statusCode,
      message
   })
})


