const express=require('express');
const cors=require('cors')
require('dotenv').config()
const connectToMongo=require('./db');
connectToMongo();
const app=express();
app.use(cors())
app.use(express.json());
app.use('/api/auth',require('./Routes/auth'));
app.use('/api/notes',require('./Routes/notes'));
app.use('/',require('./Routes/home'));
app.use('/',require('./Routes/about'));
let port = process.env.PORT || 5000;
app.listen(port, function (req, res) {
    console.log("server running Succesfully"+port);
}) 
