const sendresetlink = async (req, resp) => {
    console.log("sendlink is clicked " + req.body.email);
    const { email } = req.body;
    if (!email) {
      resp.status(401).json({ status: 401, message: "Enter Your Email" });
    }
    try {
      const userfind = await UserModel.findOne({ email: email });
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
        const mailOption = {
          from: "debobroto990@gmail.com",
          to: email,
          subject: "Password reset link Reset",
          text: `This Link valid for 30 MINUTES  http://localhost:3000/changepassword/${userfind.id}/${setUserToken.verifytoken}`,
          html: `<a href="http://localhost:3000/changepassword/${userfind.id}/${setUserToken.verifytoken}"> "http://localhost:3000/changepassword/${userfind.id}/${setUserToken.verifytoken} </a>`,
          // html: '<!DOCTYPE html>' +
          //     '<html><head>' +
          //     '</head><body><div>' +
          //     '<a href="http://localhost:3000/forgot-password/{userfind}/${setUserToken.verifytoken}"> "http://localhost:3000/forgot-password/${userfind.id}/${setUserToken.verifytoken} </a>' +
          //     '</div></body></html>'
        };
        transporter.sendMail(mailOption, (error, info) => {
          if (error) {
            console.log("error", error);
            resp.status(401).json({ status: 401, message: "email not send" });
          } else {
            console.log("email sent", info.resp);
            resp
              .status(401)
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