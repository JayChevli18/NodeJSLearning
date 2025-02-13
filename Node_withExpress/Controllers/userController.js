const User = require('../Model/userModel');
const CustomError = require('../utils/CustomError');
const authController = require('./authController');


const filterReqObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(prop => {
        if (allowedFields.includes(prop)) {
            newObj[prop] = obj[prop];
        }
    })
    return newObj;
}


exports.getAllUsers=async(req, res, next)=>{
    try {
        const users=await User.find();

        res.status(200).json({
            status:"success",
            result:users.length,
            data:{
                users
            }
        })
    } catch (error) {
        next(error);
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        //Get current user from DB
        const user = await User.findById(req.user._id).select('+password');
        const comparePassword = await user.comparePasswordInDb(req.body.currentPassword, user.password);

        if (!comparePassword) {
            return next(new CustomError("The current password you provided is wrong.", 401));
        }

        //If Supplied password is correct, update user password with new value
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save();

        authController.sendCreateResponse(user, 200, res);

    }
    catch (error) {
        next(error);
    }
}


exports.updateMe = async (req, res, next) => {

    try {
        //1. check if request data contain password or confirm password
        if (req.body.password || req.body.confirmPassword) {
            return next(new CustomError('You cannot update your password from this endpoint.', 400));
        }
        const filterObj = filterReqObj(req.body, 'name', 'email');
        const updateUser = await User.findByIdAndUpdate(req.user.id, filterObj, { runValidators: true, new: true });
        authController.sendCreateResponse(updateUser, 200, res);
        // next();
    }
    catch (error) {
        next(error);
    }
}


exports.deleteMe=async(req, res, next)=>{
    try {
        const user=await User.findByIdAndUpdate(req.user.id, {active:false});
        console.log(user);
        res.status(204).json({
            status:"success",
            data:null
        });
    } catch (error) {
        next(error);
    }
}