const fs=require("fs");
//const movies=require('../Model/movieModel.js');
const Movie = require("../Model/movieModel.js");

//let movies=JSON.parse(fs.readFileSync("./data/movies.json"));


//middleware for checking id in params
exports.checkId=(req, res, next, value)=>{
    console.log("Movie ID: "+value);

    let movie=movies.find(el=>el.id===value*1);

    if(!movie){
        return res.status(404).json({
            status:"fail",
            message:`Movie with ID ${value} not Found!`
        })
    }

    next();

}


//middleware for checking the body in the req object

exports.validateBody=(req, res, next)=>{
    if(!req.body.name || !req.body.releaseYear){
        return res.status(400).json({
            status:"fail",
            message:"Not a valid movie data"
        });
    }
    next();
}




exports.getAllMovie= async (req, res)=>{
    //using fs:
    // res.status(200).json({
    //     status:"success",
    //     count:movies.length,
    //     requestedAt:req.requestedAt,
    //     data:{
    //         movies:movies
    //     }
    // })


    //Using Mongo:
    try{
        //const movie=await Movie.find(req.query);// Query String http://localhost:4000/api/v1/movies?duration=147&ratings=2

        // const movie=await Movie.find()
        //             .where('duration')
        //             .gte(req.query.duration)
        //             .where('ratings')
        //             .gte(req.query.ratings)
        //             .where('price')
        //             .lte(req.query.price);

        let query=Movie.find(); 

        //http://localhost:4000/api/v1/movies?sort=-ratings
        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(' ');
            query=query.sort(sortBy);
        }
        else{
            query=query.sort('-createdAt');
        }
        const movie=await query;

        res.status(200).json({
            status:"success",
            length:movie.length,
            data:{
                movie
            }
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err.message
        })
    }
}

exports.createMovie= async (req, res)=>{

    //Used FS Model - Not used DB
    // const newId=movies[movies.length-1].id+1;
    // const newMovie=Object.assign({id:newId}, req.body);

    // movies.push(newMovie);

    // fs.writeFile("./data/movies.json", JSON.stringify(movies), (err)=>{
    //     res.status(201).json({
    //         status:"success",
    //         data:{
    //             movie:newMovie
    //         }
    //     })
    // })



    //MVC - Method(Used DB):

    try{
        const movie=await Movie.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                movie
            }
        })

    }
    catch(err){
        res.status(400).json({
            status:'fail',
            message:err.message
        })
    }
}


exports.getMovieByID= async (req, res)=>{
    // const id=req.params.id*1;

    // let movie=movies.find(el=>el.id===id);

    // if(!movie){
    //     return res.status(404).json({
    //         status:"fail",
    //         message:`Movie with ID ${id} not Found!`
    //     })
    // }

    // res.status(200).json({
    //     status:"success",
    //     data:{
    //         movie:movie
    //     }
    // })


    //Using Mongo:

    try{
        const movie=await Movie.findById(req.params.id);
        // console.log(req.params.id);
        // console.log(movie);
        res.status(200).json({
            status:"success",
            data:{
                movie
            }
        });
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }
}

exports.updateMovieByID=async (req, res)=>{
    // let id=req.params.id*1;
    // let movieUpdate=movies.find(el=>el.id===id);

    // if(!movieUpdate){
    //     res.status(404).json({
    //         status:"fail",
    //         message:`No movie with ID: ${id} is founnd!`
    //     })
    // }

    // let index=movies.indexOf(movieUpdate);

    // Object.assign(movieUpdate, req.body);

    // movies[index]=movieUpdate;

    // fs.writeFile('./data/movies.json', JSON.stringify(movies),(err)=>{
    //     res.status(200).json({
    //         status:"success",
    //         data:{
    //             movie:movieUpdate
    //         }
    //     })
    // })

    //Using mongodb:

    try{
        const updateMovie=await Movie.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});

        res.status(200).json({
            status:"success",
            data:{
                movie:updateMovie
            }
        })
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }

}

exports.deleteMovieByID= async (req,res)=>{
    // let id=req.params.id*1;
    // const movieToDelete=movies.find(el=>el.id===id);
    // const index=movies.indexOf(movieToDelete);

    // if(!movieToDelete){
    //     res.status(404).json({
    //         status:"fail",
    //         message:`No movie with ID: ${id} is founnd!`
    //     })
    // }


    // movies.splice(index,1);
    // fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
    //     res.status(204).json({
    //         status:"success",
    //         data:{
    //             movie:null
    //         }
    //     })
    // })


    //using mongodb:

    try{
        const deleteMovie=await Movie.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status:"success",
            data:null
        });
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }
}
