const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>res.send("Home h kya"))

module.exports=router