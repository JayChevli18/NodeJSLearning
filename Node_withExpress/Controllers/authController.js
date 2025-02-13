const User = require('../Model/userModel');
const CustomError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');
const util = require('util');
const sendEmail=require('../utils/SendEmail');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRES });
}

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new CustomError('Please provide Email & Password!', 400);
        return next(error);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
        const error = new CustomError('Incorrect Email or Password!', 400);
        return next(error);
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token,
    });
}



exports.protect = async (req, res, next) => {

    //1. Read the token from headers & check if it exists.
    try {
        const testToken = req.headers.authorization;
        let token;
        if (testToken && testToken.startsWith('Bearer')) {
            token = testToken.split(' ')[1];
        }
        if (!token) {
            next(new CustomError("You are not logged in!", 401));
        }

        //2. Validate the token
        const decodedToken = jwt.verify(token, process.env.SECRET_STR);
        console.log(decodedToken);

        //3. If user exists
        const user = await User.findById(decodedToken.id);
        if (!user) {
            const error = new CustomError('The user with the given token does not exist!', 401);
            next(error);
        }

        const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
        if (isPasswordChanged) {
            const error = new CustomError('The Password has been changed recently. Please try again.', 401);
            return next(error);
        }

        //5. Allow user to access route
        req.user = user;
        next();


    }
    catch (err) {
        next(err);
    }
}


exports.restrict = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            const error = new CustomError('You do not have permission to perform this action', 403);
            next(error);
        }
        next();
    }
}


exports.forgotPassword = async (req, res, next) => {

    try {
        //1. Get user based on posted mail
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            const error=new CustomError('We could not find the user with given email.', 404);
            next(error);
        }

        //2. Generate a random reset token
        const resetToken=user.createResetPasswordToken();
  //      console.log("AA: ",resetToken);
        await user.save({validateBeforeSave:false});


        //3. Send the token back to the user email
        const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
 //       console.log(resetUrl);
        const message = `We have received a password reset request. Please use this below link to reset your password.\n\n${resetUrl}\n\nThis reset password link will be valid for 10 minutes.`;
        
        try
        {
            console.log("XX");   
            await sendEmail({
                email: user.email,
                subject: 'Password Change request received',
                message: message
            });
            console.log("YY");
            res.status(200).json({
                status: 'success',
                message: 'password reset link send to the user email'
            })
        }
        catch(err){
            console.log("SSSSSSSS");
            user.passwordResetToken=undefined;
            user.passwordResetTokenExpires=undefined;
            user.save({validateBeforeSave: false});

            return next(new CustomError('There was error sending password reset email. Please try again after some time', 500));
        }

    } catch (error) {
        next(error);
    }

}

exports.resetPassword = (req, res, next) => {

}