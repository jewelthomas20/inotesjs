const mongoose=require('mongoose');
const dotenv = require('dotenv');
dotenv.config();



module.exports=connectToMongo=()=>{

    mongoose.connect(`mongodb+srv://jewelthomas22:${process.env.PASSWORD}@cluster0.zddcnyw.mongodb.net/inotes`,()=>console.log("connected to mongo"))
};