// npm run devStart -----to run node js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const con = require('./config/config')
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
if (con) {
    console.log("connected");
} else {
    console.log("connection faied");
}

const AuthRouter = require('./routes/authRouter');

app.use("/", AuthRouter);
// app.get("/get", (req,resp)=>{
//     resp.send("hellow");
// } )

// app.post("/insert",async (req, resp) => {
//     // const data = userModel(req.body);
//     // const data = userModel({"email":"email@gmail.com"});
//     // try {
//     //     save = data.save();
//     // } catch (err) {
//     //     console.log(err.message);
//     // }
//     console.log("insert is called"); 
//     resp.send("hay "); 
// })

// app.listen(3005);
app.listen(3005,()=>{
    console.log("connectes at port")
})
// app.listen(3005,"0.0.0.0",()=>{
//     console.log("connectes at port")
// })