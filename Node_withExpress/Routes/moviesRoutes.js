const express=require("express");
const movieController=require('../Controllers/moviesControllers');

const router=express.Router();
router.route('/')
    .get(movieController.getAllMovie)
    .post(movieController.createMovie)

router.route('/:id')
    .get(movieController.getMovieByID)
    .patch(movieController.updateMovieByID)
    .delete(movieController.deleteMovieByID)
// app.use('/api/v1/movies', moviesRouter);

module.exports=router;