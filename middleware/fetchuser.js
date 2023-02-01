const jwt = require('jsonwebtoken')

const JWT_SECRET = 'ThisStringisusedfor$ecurity'

const fetchuser=(req,res,next)=>{
   
   const token=req.header('auth-token')//will be setting name as aut-token as http header and will be passing auth-token in it, auth-token ko  hum value denge jo fr age verify hoga
   if(!token){
    res.status(401).send({error:"Enter with a valid token"})
   }
//extracting jwt token to data
    try { 
        //the token generated conatins user id and we are extracting the user id 
        const data=jwt.verify(token,JWT_SECRET)
        req.user=data.user 
    next()// this refers to next function after where this current fetch middleware is used

    } catch (error) {
        console.error(error)
        res.status(401).send({error:"Enter with a valid token"})
    }
}
module.exports=fetchuser