const express = require('express');
const { body, validationResult } = require('express-validator');//express validation checker
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../Models/User');
// const fetchuser = require('../middleware/fetchuser');

JWT_SECRET = 'ThisStringisusedfor$ecurity'

//   /api/auth/createUser   --------Creating a user
router.post('/createUser',[

  body('name', 'Name should be minimum 3 letter').isLength({ min: 3 }),//express validation se 'name' validate kr rhe h and , 'error message type'
  body('email', 'Enter a proper email').isEmail(),
  body('password', 'Minimum password length should be 5').exists().isLength({ min: 5 }),
],
  async (req, res) => {
    // let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ error: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
      console.log(errors.array())

        return res.status(400).json({ error: "A user already exist with this email try another email" })
      }
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password, salt)
      //creating a user  =======================================================
      user = new User({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })
      user.save()
      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET)//token for current user is generated 
      // success=true;
      res.json({"success":authToken})//jwt token is being send so that it will land to login page directly after signup
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message })
    }
    // my way of finding existing email and giving error or creating new user with out using async await
    // User.findOne({email:req.body.email},(err,foundMail)=>{   
    //     if(!err){
    //         if(foundMail){
    //             res.send("User Exist with same Email")
    //         }
    //         else{
    //             const user=new User(req.body);
    //             user.save();
    //             console.log("New UserCreated");
    //             res.send("New UserCreated");
    //         }
    //     }
    // })
  })

//   /api/auth/login   --------Login url for user==============================================================
router.post('/login',[
  body('email', 'Enter a proper email  ').isEmail(),
  body('password', 'Password cannot be blank').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email });
      if (!user) {  
      return res.status(400).json({error: "Enter Correct Credentials" })
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        success=false;
        return res.status(400).json({error: "Enter Correct Credentials " })
      }
      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET)
      res.json({"success":authToken})//taki front end mai authtoken utha skee using success
    } catch (error) {
      console.log(error.message);
      res.status(500).send({error:error.message})
    }
  })


//   /api/auth/getuser   --------Fetch url for user   

// THIS CODE IS NOT USED FOR THE PROJECT ITS JUST A EXAMPLE TO GET USER DETAILS 

// router.post('/getuser',fetchuser,async (req, res) => {
//   try {
//     const userID=req.user.id;//user id from req obj obtained from jwt token
//     const user=await User.findById(userID).select("-password");//will select every user data excluding password
//     res.send(user)
//   } catch (error) {
//     console.error(error)
//     res.status(500).send({error:"Internal server error"})

//   }
//   }) 




  
module.exports = router 