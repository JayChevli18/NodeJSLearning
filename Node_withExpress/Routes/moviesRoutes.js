const express=require("express");
const movieController=require('../Controllers/moviesControllers');

const router=express.Router();

//router.param('id', movieController.checkId)

router.route('/')
    .get(movieController.getAllMovie)
    .post(movieController.createMovie);
    //.post(movieController.validateBody,movieController.createMovie) //Firstly it will execute validatebody middleware which will che if the request contain body or not...then if it successfull then createMovie will be executed

router.route('/:id')
    .get(movieController.getMovieByID)
    .patch(movieController.updateMovieByID)
    .delete(movieController.deleteMovieByID)
// app.use('/api/v1/movies', moviesRouter);

module.exports=router;