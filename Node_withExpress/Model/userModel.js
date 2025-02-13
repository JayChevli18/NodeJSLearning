const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const crypto=require('crypto');

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
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
    ,
    password:{
        type: String,
        required: [true, 'Please Enter a Password.'],
        minlength: 8,
        select: false
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
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken:{
        type: String
    },
    passwordResetTokenExpires:{
        type: Date
    }

})


userSchema.pre('save', async function (next) {
    if(!this.isModified('password'))
        return next();

    this.password=await bcrypt.hash(this.password, 12);
    this.confirmPassword=undefined;
    next();
})


//This is an instance method which is created on userSchema.
//This method will allow us to compare password provided while login and password which is stored in DB. 
//Here pswd will get hashed and then compared with pswdDb.
userSchema.methods.comparePasswordInDb=async function(pswd, pswdDb){
    return await bcrypt.compare(pswd, pswdDb);
}

userSchema.methods.isPasswordChanged=async function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const pswdChangedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(pswdChangedTimeStamp, JWTTimeStamp);
        return JWTTimeStamp<pswdChangedTimeStamp;
    }
    return false;
}


userSchema.methods.createResetPasswordToken=function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires=Date.now()+10*60*1000;

    console.log("DD: ",resetToken, this.passwordResetToken);
    return resetToken;
}


const User=mongoose.model('User', userSchema);
module.exports=User;