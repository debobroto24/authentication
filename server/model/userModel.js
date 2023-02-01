const mongoose = require('mongoose');
const keysecret= "jdheyuhgtresdfgvcbjhuioplkiuythg"; 
const jwt = require('jsonwebtoken');

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
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    verifytoken:{
        type: String,
    }
});
AuthSchema.methods.generateAuthtoken = async function () {
    try {
        let token =await jwt.sign({ _id: this._id }, keysecret, {
            expiresIn: "1d"
        });
        console.log("token 23 working");

        this.tokens =await this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.status(422).json(error)
    }
}

const UserModel = mongoose.model('users', AuthSchema);

module.exports = UserModel;