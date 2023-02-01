const mongoose=require('mongoose')

const NoteSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,// refer to object id of the user collections
        ref:'user'
    },
    title:{
        type: String,
        require:true,
        },
    description:{
        type: String,
        require:true,
        },
    tag:{
            type: String,
            default:"General"  
        },
    timestamp:{
            type:Date,
            default:Date.now
        }
})
const Note=mongoose.model('note',NoteSchema)
module.exports=Note