const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String,
        trim: true,
    },
    lastname: {
        required: true,
        type: String,
        trim: true,
    },
    username: {
        required: true,
        type: String,
        trim: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
                const re =
                    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            }, 
            message:"Please enter a vlid email address", 
        }
    }, 
    password:{
        require: true, 
        type:String, 
        validate:{
            validator:(value)=>{
                // const repass =  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"; 
                const repass = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"; 
                //  const repass = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$."; 
                //  const repass = "/^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[^a-zA-Z0-9])(?!.*\s).{8,15}$/"; 
                 const regpa = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/; 
                 var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                return value.match(re); 
            }, 
            message:"Your password not meeting requirement",
        }
    }

});

const AuthModel = mongoose.model('users', AuthSchema);

module.exports = AuthModel;