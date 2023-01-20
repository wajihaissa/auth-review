const mongoose=require("mongoose");
const connectDb=async()=>{
    try{
       await mongoose.connect(process.env.dbconnect)
       console.log("database connected"); 
    }
    catch(error){
        console.log('database not connected')
    }

}
module.exports= connectDb