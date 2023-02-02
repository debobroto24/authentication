const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const UserModel = require("./model/userModel");
const UsernameModel = require("./model/userModel");
const nodemailer = require("nodemailer");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require('path');
var hbs = require('nodemailer-express-handlebars');

const keysecret = "jdheyuhgtresdfgvcbjhuioplkiuythg";
// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "debobroto990@gmail.com",
//         // pass:"mpnmennahmlekosb"
//         pass: "eebvysejrxzizdes",
//     }
// })

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "neo21071999@gmail.com",
    pass: "gmojorsvsvzonxan",
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve('./views'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views'),
  extName: ".handlebars",
}

transporter.use('compile', hbs(handlebarOptions));

const getData = async (req, resp) => {
  const res = await UserModel.find();
  console.log(res);
  resp.send(res);
};

const checkusername = async (req, resp) => {
  try {
    const { username } = req.body;
    console.log(req.body.username);
    const findUsername = await UserModel.findOne({ username });
    console.log("finduername"+findUsername);
    if (findUsername) {
      return resp.status(201).send({ status: 201, msg: "usernameExist" });
    } else {
      return resp.status(401).json({ status: 401, msg: "notExits" });
    }
  } catch (e) {
    return resp.status(500).json({ error: e.message });
    console.log(err.message);
  }

  // resp.send("hay "+req.body['username']);
};
const registration = async (req, resp) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    const data = UserModel(req.body);
    const existingUsername = await UserModel.findOne({ username });
    const existingUserEmail = await UserModel.findOne({ email });
    if (existingUserEmail) {
      return resp
        .status(401)
        .json({ status: 401, message: "This email is alwready used" });
    }

    if (!existingUserEmail && !existingUsername) {
      const cushashedPassword = await bcryptjs.hash(password, 8);
      let user = new UserModel({
        firstname,
        lastname,
        username,
        email,
        hashPassword: cushashedPassword,
      });
      user = await user.save();
      return resp
        .status(201)
        .json({ status: 201, message: "Signup Successfully" });
      
    }

    resp.json(user);
  } catch (e) {
    return resp.status(500).json({ error: e.message });
    console.log(err.message);
  }
  console.log(req.body["username"]);
  console.log(req.body["email"]);
  console.log(req.body["username"]);
  console.log(req.body["username"]);
  console.log("insert is called");
  // resp.send("hay "+req.body['username']);
};

const login = async (req, resp) => {
  try {
    const { username, password } = req.body;
    console.log("auth controller login click");
    console.log(username);
    const user = await UserModel.findOne({ username });
    if (!user) {
      // return resp.status(400).json({ msg: "user name" });
      return resp.status(401).send({status:401, message: "Invalid Credentials. Please try again" });
    }

    const isMatch = await bcryptjs.compare(password, user.hashPassword);
    console.log(isMatch);
    if (!isMatch) {
      console.log("password not matched");
      return resp
        .status(401)
        .json({status:401, message: "Invalid Credentials. Please try again" });
    }
    if (user && isMatch) {
      console.log("match every thing");
      const token = await user.generateAuthtoken();
      console.log("token " + token);
      console.log("successful login");
      if(token){
        console.log("token generated"); 
        
      }else{
        console.log(
          "token not generated"
                  )
      }
      // resp.cookie("usercookie", token, {
      //     expires: new Date(Date.now() + 9000000),
      //     httpOnly: true,
      // })

      const result = {
        user,
        token,
      };
      console.log(result);

      return resp.status(201).json({ status: 201, result });
    } else {
      console.log("login not successfull");
      return resp.status(401).send({status:401, message: "Invalid Credentials. Please try again" });
    }
  } catch (e) {
    return resp.status(500).json({ error: e.message });
  }
};

// email config

const sendresetlink = async (req, resp) => {
  console.log("sendlink is clicked " + req.body.email);
  const { email } = req.body;

  try {

    const userfind = await UserModel.findOne({ email: email });
    if (!email) {
        resp.status(401).json({ status: 401, message: "Enter Your Email" });
      }
    // console.log("userfind " + userfind);
    const token = jwt.sign({ _id: userfind._id }, keysecret, {
      expiresIn: "1800s",
    });
    // console.log("sendlink webtoken " + token);
    const setUserToken = await UserModel.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );

    if (setUserToken) {
    //   const mailOption = {
    //     from: "debobroto990@gmail.com",
    //     to: email,
    //     subject: "Password reset link Reset",
    //     text: `This Link valid for 30 MINUTES  http://localhost:3000/changepassword/${userfind.id}/${setUserToken.verifytoken}`,
    //     html:jfsdl, 
    //   };
   
      
      var mailOptions = {
        from: 'debobroto990@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        template: 'ResetPassword',
        context: {
          id:userfind.id,
          token: setUserToken.verifytoken,
          username: userfind.username
        }
      
      };
      
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error", error);
          resp.status(401).json({ status: 401, message: "email not send" });
        } else {
          console.log("email sent", info.resp);
          resp
            .status(201)
            .json({ status: 201, message: "email send Successfully" });
        }
      });
    
    }
    //token generate
    // const token = jwt.sign({_id:userfind._id},)
  } catch (error) {
    resp.status(401).json({ status: 401, message: "Invalid User" });
  }
};

const passwordresetconfirmation = async (req, resp) => {
  console.log("sendlink is clicked " + req.body.email);
  const { email } = req.body;

  try {

    const userfind = await UserModel.findOne({ email: email });
    if (!email) {
        resp.status(401).json({ status: 401, message: "Enter Your Email" });
      }
    // console.log("userfind " + userfind);
    const token = jwt.sign({ _id: userfind._id }, keysecret, {
      expiresIn: "1800s",
    });
    // console.log("sendlink webtoken " + token);
    const setUserToken = await UserModel.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );

    if (setUserToken) {
    //   const mailOption = {
    //     from: "debobroto990@gmail.com",
    //     to: email,
    //     subject: "Password reset link Reset",
    //     text: `This Link valid for 30 MINUTES  http://localhost:3000/changepassword/${userfind.id}/${setUserToken.verifytoken}`,
    //     html:jfsdl, 
    //   };
   
      
      var mailOptions = {
        from: 'debobroto990@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        template: 'ResetPassword',
        context: {
          id:userfind.id,
          token: setUserToken.verifytoken,
          username: userfind.username
        }
      
      };
      
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error", error);
          resp.status(401).json({ status: 401, message: "email not send" });
        } else {
          console.log("email sent", info.resp);
          resp
            .status(201)
            .json({ status: 201, message: "email send Successfully" });
        }
      });
    
    }
    //token generate
    // const token = jwt.sign({_id:userfind._id},)
  } catch (error) {
    resp.status(401).json({ status: 401, message: "Invalid User" });
  }
};

const checkuser = async (req, resp) => {
  const { id, token } = req.params;
  console.log(token);
  console.log("hei password change");
  try {
    // const validuser = await UserModel.findOne({ _id: id, verifytoken: token });
    const validuser = await UserModel.findOne({ _id: id, verifytoken: token });
    // console.log(validuser);
    // const verifytokenhere = jwt.verify(token,keysecret);
    // console.log("verify toeke "+ verifytokenhere);

    if (validuser) {
      console.log("check user valid");
      resp.status(201).json({ status: 201, validuser });
    } else {
      console.log("check user not valid");
      resp
        .status(401)
        .json({
          status: 401,
          message: "Link expired please generate link again!",
        });
    }
  } catch (error) {
    resp.status(401).json({ status: 401, message: "Invalid User" });
  }
};
const changeoldpassword = async (req, resp) => {
  const { id } = req.params;
  const { oldpassword, password } = req.body;
  console.log("change old passowrd");
  try {
    const validuser = await UserModel.findOne({ _id: id });
    if (validuser) {
      console.log("valid user");
    } else {
      console.log("not valid");
    }

    if (validuser) {
      const isMatch = await bcryptjs.compare(oldpassword, validuser.hashPassword);
      if (!isMatch) {
        console.log("password not matched");
        return resp
          .status(401)
          .send({ status: 401, message: "Old password not matched" });
      } else {
        console.log("password  matched");
        console.log(oldpassword);
        console.log("newpass" + oldpassword);
        const cushashedPassword = await bcryptjs.hash(password, 8);
        const setnewuserpassword = await UserModel.findByIdAndUpdate(
          { _id: id },
          { hashPassword: cushashedPassword }
        );
        await setnewuserpassword.save();
        if (setnewuserpassword) {
          console.log("password set");
        } else {
          console.log("password not  set");
        }
        return resp
          .status(201)
          .send({ status: 201, message: "password change successfully" });
      }
    } else {
      resp.status(401).json({ status: 401, message: "Password not changed" });
    }
  } catch (error) {
    resp.status(401).json({ status: 401, message: "Password not changed" });
  }
};

const setpassword = async (req, resp) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const validuser = await UserModel.findOne({ _id: id, verifytoken: token });
    if (validuser) {
      const cushashedPassword = await bcryptjs.hash(password, 8);
      const setnewuserpassword = await UserModel.findByIdAndUpdate(
        { _id: id },
        { hashPassword: cushashedPassword }
      );
      await setnewuserpassword.save();
      if(setnewuserpassword){
        console.log("password set");
        console.log(validuser.email);
        var mailOptions = {
          
          from: 'debobroto990@gmail.com',
          to: validuser.email,
          subject: 'Sending Email using Node.js',
          template: 'PasswordResetConfirmation',
          context: {
            id:validuser.id,
            token: token,
            username: validuser.username
          }
        
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log("confirmation email password changed", error);
            
          } else {
            console.log("email sent", info.resp);
          }
        });
      return  resp
        .status(201)
        .json({ status: 201, message: "password changed successfully" });
      
      }else{
        console.log("password not set");
      }
     
    } else {
      resp.status(401).json({ status: 401, message: "Password not change. please try again" });
    }
  } catch {
    resp.status(401).json({ status: 401, message: "Something went wrong. please try again" });
  }
};

const deleteUser = async (req, resp) => {
  await UserModel.deleteOne({ _id: req.params.id });
};

const userDetail = async (req, resp) => {
  const data = await UserModel.find({ _id: req.params.id });
  resp.send(data);
};

module.exports = {
  getData,
  registration,
  login,
  checkusername,
  sendresetlink,

  deleteUser,
  userDetail,
  checkuser,
  setpassword,
  changeoldpassword,
  passwordresetconfirmation,
};
