const CustomError=require('../utils/CustomError');

const handleTokenExpiredError=(err)=>{
    return new CustomError('JWT has expired! Please Login Again', 401);
}

const handleJsonWebTokenError=(err)=>{
    return new CustomError('Invalid Token, Please try Again!', 401);
}


module.exports=(error, req, res, next)=>{
    error.statusCode=error.statusCode || 500;
    error.status=error.status || 'error';

    if(error.name=='JsonWebTokenError'){
        error=handleJsonWebTokenError(error);
    }
    if(error.name=='TokenExpiredError'){
        error=handleTokenExpiredError(error);
    }

    res.status(error.statusCode).json({
        status:error.statusCode,
        message:error.message
    })
}