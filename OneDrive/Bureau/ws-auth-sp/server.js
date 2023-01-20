
const express =require("express")
const connectDB=require("./config/DBconnect")
const app=express()
require("dotenv").config()
const port=process.env.PORT
connectDB()
app.use(express.json())
app.use("/user",require("./routs/UserRoutes"))


app.listen(port,(err)=>{
    err?console.log(err):console.log(`srever running on ${port}`)
})