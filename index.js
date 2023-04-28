import mongoose from 'mongoose'
import app from './app.js'
import config from"./config/index.js"

//create a fn
//run a function

(async()=>{
    try{

        await mongoose.connect(config.MONGO_URL)
        console.log("DB Connected");

        app.on('error',(err)=>{
            console.log("ERROR",err);
            throw err;
        })
        
       const onListening = ()=>{
        console.log(`listening on ${config.PORT}`);
       }

        app.listen(config.PORT,onListening)

    }catch(err){
        console.log("Error")
        throw err//kill the execution
    }
})