const express=require("express");
const movieController=require('../Controllers/moviesControllers');

const router=express.Router();

//router.param('id', movieController.checkId)

router.route('/highest-rated').get(movieController.getHighestRated, movieController.getAllMovie);

router.route('/movie-stats').get(movieController.getMovieStats);

router.route('/movie-by-genre/:genre').get(movieController.getMovieByGenre);

router.route('/')
    .get(movieController.getAllMovie)
    .post(movieController.createMovie);
    //.post(movieController.validateBody,movieController.createMovie) //Firstly it will execute validatebody middleware which will che if the request contain body or not...then if it successfull then createMovie will be executed

router.route('/:id')
    .get(movieController.getMovieByID)
    .patch(movieController.updateMovieByID)
    .delete(movieController.deleteMovieByID)
// app.use('/api/v1/movies', moviesRouter);

router.all('*',(req,res,next)=>{
    res.status(404).json({
        status:'fail',
        message: `Can't find ${req.originalUrl} on the server!`
    });    
});

module.exports=router;