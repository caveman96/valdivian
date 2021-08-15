//loading express and cors
const express = require('express');
const cors = require('cors');
const auth = require('./services/auth');

//this will load environment variables into the process variable
require('dotenv').config();

//creating the express app
const app = express();
const port = process.env.PORT || 5000;
//since we will be sending and recieving data in json format
app.use(express.json());

app.use(cors());
//Use auth method as the middleware to do authentication
app.use(auth.doAuth);

//loading mongoose and the mongoDB uri
const mongoose = require('mongoose');
const uri = process.env.ATLAS_URI;
//connecting to mongodb (tje arguments are specific to atlas)
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
//logging once connection creation has happened
connection.once('open', () => {
    console.log("MongoDB connection established successfully");
})

//load routes
const userRouter = require('./routes/users');
const productRouter = require('./routes/products');
//use the routes to redirect these endpoints to the respective files
app.use('/products', productRouter);
app.use('/users', userRouter);

//register auth endpoint
app.get("/token", auth.createToken);

app.get("/test", (req,res)=>{
    res.send("hello world");
})

//starting the server
app.listen(port, ()=>{
	console.log(`server is running on port: ${port}`);
});