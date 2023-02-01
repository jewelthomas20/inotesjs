const express=require('express');
const router=express.Router();

router.get('/about',(req,res)=>res.send("about hai kya h kya"))

module.exports=router