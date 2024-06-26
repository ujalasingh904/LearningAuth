import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js" 
import cookieParser from "cookie-parser"; 
// import path from 'path';

dotenv.config()

mongoose
   .connect(process.env.MONGODB_URL)
   .then(() => {
      console.log('conected to database')
   })
   .catch((err) => console.log(err))
   
// const __dirname = path.resolve();

const app = express() 

// app.use(express.static(path.join(__dirname, '/frontend/dist')));
// app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
//  });

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port:`, port))
app.use(express.json())
app.use(cookieParser())

app.use("/api/users/", userRoutes)
app.use("/api/auth/", authRoutes)

app.use((err, req, res, next) => {
   const statusCode = err.statuscode || 500
   const message  = err.message || "Internal server error"
  
   return res.status(statusCode).json({ 
      success:false,
      statusCode,
      message
   })
})


