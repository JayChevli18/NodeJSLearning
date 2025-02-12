const User = require('../Model/userModel');
const CustomError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');
const util = require('util');


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
        const user=await User.findById(decodedToken.id);
        if(!user){
            const error=new CustomError('The user with the given token does not exist!',401);
            next(error);
        }

        const isPasswordChanged=await user.isPasswordChanged(decodedToken.iat);
        if(isPasswordChanged){
            const error=new CustomError('The Password has been changed recently. Please try again.',401);
            return next(error);
        }
        
        //5. Allow user to access route
        req.user=user;
        next();


    }
    catch (err) {
        next(err);
    }
}


exports.restrict=(role)=>{
    return(req, res, next)=>{
        if(req.user.role===role){
            const error=new CustomError('You do not have permission to perform this action', 403);
            next(error);
        }
        next();
    }
}