const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const UserModel = require('../model/userModel');
const UsernameModel = require('../model/userModel');
const nodemailer = require("nodemailer");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");

const keysecret = "jdheyuhgtresdfgvcbjhuioplkiuythg"
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "debobroto990@gmail.com",
        // pass:"mpnmennahmlekosb"
        pass: "eebvysejrxzizdes",
    }
})
const getData = async (req, resp) => {
    const res = await UserModel.find();
    console.log(res);
    resp.send(res);
}

const checkusername = async (req, resp) => {
    try {
        const { username } = req.body;
        console.log(req.body.username)
        const findUsername = await UserModel.findOne({ username });
        console.log(findUsername);
        if (findUsername) {
            return resp.status(201).send({status:201, msg: "usernameExist" })
        } else {
            return resp.status(400).json({status:400, msg: "notExits" });
        }


    } catch (e) {
        return resp.status(500).json({ error: e.message });
        console.log(err.message);
    }

    // resp.send("hay "+req.body['username']);
}
const registration = async (req, resp) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;
        const data = UserModel(req.body);
        const existingUsername = await UserModel.findOne({ username });
        const existingUserEmail = false;
        if (existingUserEmail) {
            return resp.status(401).json({status:401, message: "This email is alwready used" });
        }
        
      
        if(!existingUserEmail && !existingUsername){
            const hashedPassword = await bcryptjs.hash(password, 8);
            let user = new UserModel({
                firstname,
                lastname,
                username,
                email,
                password: hashedPassword,
            });
            user = await user.save();   
            return resp.status(201).json({status:201,message:"Signup Successfully"});ta


        }
       
        resp.json(user);
    } catch (e) {
        return resp.status(500).json({ error: e.message });
        console.log(err.message);
    }
    console.log(req.body['username']);
    console.log(req.body['email']);
    console.log(req.body['username']);
    console.log(req.body['username']);
    console.log("insert is called");
    // resp.send("hay "+req.body['username']);
}

const login = async (req, resp) => {
    try {
        const { username, password } = req.body;
        console.log("auth controller login click");
        console.log(username);
        const user = await UserModel.findOne({ username });
        if (!user) {
            // return resp.status(400).json({ msg: "user name" });
            return resp.send({ msg: "Invalid Credentials. Please try again" });
        }
        
        const isMatch =await bcryptjs.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return resp.status(400).json({ msg: "Invalid Credentials. Please try again" });
        }
        if (user && isMatch) {
            const token = await user.generateAuthtoken();
            console.log("token " + token);
            console.log("successful login");
            
            // resp.cookie("usercookie", token, {
            //     expires: new Date(Date.now() + 9000000),
            //     httpOnly: true,
            // })

            const result = {
                user , 
                token
            }
            console.log(result)

            resp.status(201).json({ status: 201, result });
        } else {
            return resp.send({ msg: "Invalid Credentials. Please try again" })
        }
    } catch (e) {
        return resp.status(500).json({ error: e.message });
    }
}

// email config  


const sendresetlink = async (req, resp) => {
    console.log("sendlink is clicked " + req.body.email);
    const { email } = req.body;
    if (!email) {
        resp.status(401).json({ status: 401, message: "Enter Your Email" });
    } try {
        const userfind = await UserModel.findOne({ email: email });
        // console.log("userfind " + userfind);
        const token = jwt.sign({ _id: userfind._id }, keysecret, {
            expiresIn: "1800s"
        });
        // console.log("sendlink webtoken " + token);
        const setUserToken = await UserModel.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true });

        if (setUserToken) {
       
            const mailOption = {
                from: "debobroto990@gmail.com",
                to: email,
                subject: "Password reset link Reset",
                text: `This Link valid for 30 MINUTES  http://localhost:3000/changepassword/${userfind.id}/${setUserToken.verifytoken}`,
                html:`<a href="http://localhost:3000/changepassword/${userfind.id}/${setUserToken.verifytoken}"> "http://localhost:3000/changepassword/${userfind.id}/${setUserToken.verifytoken} </a>`
                // html: '<!DOCTYPE html>' +
                //     '<html><head>' +
                //     '</head><body><div>' +
                //     '<a href="http://localhost:3000/forgot-password/{userfind}/${setUserToken.verifytoken}"> "http://localhost:3000/forgot-password/${userfind.id}/${setUserToken.verifytoken} </a>' +
                //     '</div></body></html>'

                
            }
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log("error", error);
                    resp.status(401).json({ status: 401, message: "email not send" });
                } else {
                    console.log("email sent", info.resp);
                    resp.status(401).json({ status: 201, message: "email send Successfully" });

                }
            })
        }
        //token generate 
        // const token = jwt.sign({_id:userfind._id},)
    } catch (error) {
        resp.status(401).json({ status: 401, message: "Invalid User" });
    }
}

const changepassword = async (req, resp) => {
    const { id, token } = req.params;
    console.log(token);
    console.log("hei password change");
    try {
        // const validuser = await UserModel.findOne({ _id: id, verifytoken: token });
         const validuser = await UserModel.findOne({_id:id, verifytoken: token});
        console.log(validuser);
        // const verifytokenhere = jwt.verify(token,keysecret); 
        // console.log("verify toeke "+ verifytokenhere);

        if(validuser){
            resp.status(201).json({status:201,validuser});
        }else{
            resp.status(401).json({status:401,message:"Link expired please generate link again!" }); 
        }

    } catch (error) {
        resp.status(401).json({ status: 401, message: "Invalid User" });
    }
}
const changeoldpassword = async (req, resp) => {
    const {id} = req.params;
    const {oldpassword , password} = req.body; 
    console.log("change old passowrd");
    try {
         const validuser = await UserModel.findOne({_id:id});
         if(validuser){
            console.log("valid user");
         }else{
            console.log("not valid");
         }
        
        if(validuser){
            const isMatch =await bcryptjs.compare(oldpassword, validuser.password);
            if(!isMatch){
                console.log("password not matched");
                return resp.status(401).send({status:401,message:"Old password not matched"});
            }else{
                console.log("password  matched");
                console.log(oldpassword)
                console.log("newpass"+oldpassword);
                const hashedPassword = await bcryptjs.hash(password, 8);
                const setnewuserpassword = await UserModel.findByIdAndUpdate({_id:id},{password: hashedPassword}); 
                await setnewuserpassword.save();
                if(setnewuserpassword){
                    console.log("password set");
                }else{
                    console.log("password not  set");
                }
                return resp.status(201).send({status:201,message:"password change successfully"});
            }

        }else{
            resp.status(401).json({ status: 401, message: "Password not changed" });
        }

    } catch (error) {
        resp.status(401).json({ status: 401, message: "Password not changed" });
    }
}

const setpassword = async (req, resp) => {
    const { id, token } = req.params;
    const {password} = req.body; 
    try{
    const validuser = await UserModel.findOne({_id:id, verifytoken: token});
        if(validuser){
            const hashedPassword = await bcryptjs.hash(password, 8);
            const setnewuserpassword = await UserModel.findByIdAndUpdate({_id:id},{password: hashedPassword}); 
           await setnewuserpassword.save();
            resp.status(201).json({ status: 201, message: "password change successfully" });

        }else{
            resp.status(401).json({ status: 401, message: "user not exit" });

        }
   

    }catch{
        resp.status(401).json({ status: 401, message: "Invalid User" });

    }
  
}



const deleteUser = async (req, resp) => {
    await UserModel.deleteOne({ _id: req.params.id });
}

const userDetail = async (req, resp) => {
    const data = await UserModel.find({ _id: req.params.id })
    resp.send(data);
}

module.exports = {
    getData,
    registration,
    login,
    checkusername,
    sendresetlink,

    deleteUser,
    userDetail,
    changepassword,
    setpassword,
    changeoldpassword, 

}