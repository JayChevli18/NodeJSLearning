const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please Enter your Name.']
    },
    email:{
        type:String,
        required:[true, 'Please Enter your Email.'],
        unique: true,
        validate:[validator.isEmail, 'Please Enter a Valid Email.']
    },
    photo:{
        type: String
    },
    password:{
        type: String,
        required: [true, 'Please Enter a Password.'],
        minlength: 8,
    },
    confirmPassword:{
        type:String,
        required: [true, 'Please Confirm your Password.'],
        validate:{
            validator: function(val){
                return val==this.password;
            },
            message: 'Password & Confirm Password does not match!'
        }
    }
})


userSchema.pre('save', async function (next) {
    if(!this.isModified('password'))
        return next();

    this.password=await bcrypt.hash(this.password, 12);
    this.confirmPassword=undefined;
    next();
})

const User=mongoose.model('User', userSchema);
module.exports=User;