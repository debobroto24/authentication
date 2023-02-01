const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const AuthController = require('../controller/authController');
// const userModel = require('../model/authModel');
// router.get("/read", userCon.getData);
router.post("/registration", AuthController.registration);
router.post("/login", AuthController.login);
router.post("/checkusername", AuthController.checkusername);
router.post("/sendresetlink", AuthController.sendresetlink);
router.get("/changepassword/:id/:token", AuthController.changepassword);
router.post("/:id/:token",AuthController.setpassword);
router.post("/:id",AuthController.changeoldpassword);
// router.post("/changeoldpassword/:id",AuthController.changeoldpassword);
// router.delete('/delete/:id',userCon.deleteUser)
// router.get('/user/:id', userCon.userDetail);
module.exports = router;