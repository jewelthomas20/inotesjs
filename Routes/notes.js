const express=require('express');
const { body, validationResult } = require('express-validator');//express validation checker
const router=express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note =require('../Models/Notes')

//fetchuser is providing the user id of current user through jwt  token

// Route 1 to fetech all notes using GET  login required /api/notes/fetchallnotes
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try{ 
        const notes= await Note.find({user:req.user.id})
        res.json(notes)
    }catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal error" })
  }
})


// Route 2 Add a new note using POST  login required  /api/notes/addnote

router.post('/addnote',fetchuser,[
body('title', 'Enter a title with minimum 3 letters').isLength({ min: 3 }),
body('description', 'Enter a description with minimum 3 letters').isLength({ min: 5 })
],async (req,res)=>{
    try {
    const {title,description,tag}=req.body // accesing the data from body and assigning it by deconstruction
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    
    const note=new Note({
        title,description,tag,user:req.user.id

    });
    note.save()
    res.send(note)
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "internal error" })
  }
    })

// Route 3 Updating the note using Put and also verifying user  login required  /api/notes/updatenotes/:id

router.put('/updatenotes/:id',fetchuser,async(req,res)=>{
try{

    const {title,description,tag}=req.body;
    //finding where the noteid exist or not
    let note= await Note.findById(req.params.id)//finding notes by object id of the note
if(!note){
    return res.status(404).send("Note Not Found")
}
//checking whethere user is same or not 
if(note.user.toString()!== req.user.id.toString()){ 
    console.log(req.user.id)
    console.log(note.user.toString()===req.user.id)
    return res.status(401).send("Access Denied")
}
//creating new note
let newNote= {
    title:title,
    description:description,
    tag:tag
}
//updating note
note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote})
res.send(newNote)
}catch(error){
    console.error(error.message)
    res.status(500).send("Internal server Error")
}
})

// Route 4 Deleting the note using Delete and also verifying user  login required  /api/notes/deletenote/:id

router.delete ('/deletenote/:id',fetchuser,async(req,res)=>{
    try{
    
        //finding where the noteid exist or not
        let note= await Note.findById(req.params.id)
    if(!note){
        return res.status(404).send("Note Not Found")
    }
    //checking whethere user is same or not by note ke user mai jo id hai usse match kra req object extracted from jwt token
    if(note.user.toString()!== req.user.id.toString()){
        return res.status(401).send("Access Denied")
    }
    note=await Note.findByIdAndDelete(req.params.id)
    res.send("Succesfully Deleted "+note)
    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal server Error")
    }
    })

module.exports=router