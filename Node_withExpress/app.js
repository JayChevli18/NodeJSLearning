const express=require("express");
// const fs=require("fs");
const morgan = require("morgan");
const mongoose=require("mongoose");
const moviesRouter=require('./Routes/moviesRoutes');
const dotenv=require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGOURL,{
    useNewUrlParser:true
}).then((conn)=>console.log("conn")).catch((err)=>{console.log("errpr", err)});


// const testMovie=new Movie({
//     name:"Ghost Rider",
//     description:"An Action - Drama film.",
//     duration: 100
// })

// testMovie.save().then((doc)=>{
//     console.log(doc);
// })
// .catch((err)=>{
//     console.log("Error Occurred: ", err);
// });


let app=express();
// let movies=JSON.parse(fs.readFileSync("./data/movies.json"));

app.use(express.json());

//3rd party Middleware:
app.use(morgan("dev"));

//Static file
app.use(express.static('./public'));//access html file via http://localhost:4000/templates/demo.html


//custom middleware:
const logger=(req,res,next)=>{
    console.log("Custom middleware logger is called!");
    next();
}
app.use(logger);

app.use((req,res, next)=>{
    req.requestedAt=new Date().toISOString();
    next();
})


// app.get('/', (req, res)=>{
//     res.status(200).send("<h1>Hell From Server</h1");
// })

// app.get('/json',(req, res)=>{
//     res.status(200).json({message:"Hello", status:200});
// })



// const getAllMovie=(req, res)=>{
//     res.status(200).json({
//         status:"success",
//         count:movies.length,
//         requestedAt:req.requestedAt,
//         data:{
//             movies:movies
//         }
//     })
// }

// const createMovie=(req, res)=>{
//     const newId=movies[movies.length-1].id+1;
//     const newMovie=Object.assign({id:newId}, req.body);

//     movies.push(newMovie);

//     fs.writeFile("./data/movies.json", JSON.stringify(movies), (err)=>{
//         res.status(201).json({
//             status:"success",
//             data:{
//                 movie:newMovie
//             }
//         })
//     })
// }


// const getMovieByID=(req, res)=>{
//     const id=req.params.id*1;

//     let movie=movies.find(el=>el.id===id);

//     if(!movie){
//         return res.status(404).json({
//             status:"fail",
//             message:`Movie with ID ${id} not Found!`
//         })
//     }

//     res.status(200).json({
//         status:"success",
//         data:{
//             movie:movie
//         }
//     })
// }

// const updateMovieByID=(req, res)=>{
//     let id=req.params.id*1;
//     let movieUpdate=movies.find(el=>el.id===id);

//     if(!movieUpdate){
//         res.status(404).json({
//             status:"fail",
//             message:`No movie with ID: ${id} is founnd!`
//         })
//     }

//     let index=movies.indexOf(movieUpdate);

//     Object.assign(movieUpdate, req.body);

//     movies[index]=movieUpdate;

//     fs.writeFile('./data/movies.json', JSON.stringify(movies),(err)=>{
//         res.status(200).json({
//             status:"success",
//             data:{
//                 movie:movieUpdate
//             }
//         })
//     })

// }

// const deleteMovieByID=(req,res)=>{
//     let id=req.params.id*1;
//     const movieToDelete=movies.find(el=>el.id===id);
//     const index=movies.indexOf(movieToDelete);

//     if(!movieToDelete){
//         res.status(404).json({
//             status:"fail",
//             message:`No movie with ID: ${id} is founnd!`
//         })
//     }


//     movies.splice(index,1);
//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
//         res.status(204).json({
//             status:"success",
//             data:{
//                 movie:null
//             }
//         })
//     })

// }


// app.get('/api/v1/movies', getAllMovie);
// app.post('/api/v1/movies', createMovie);
// app.get('/api/v1/movies/:id', getMovieByID);
// app.patch('/api/v1/movies/:id', updateMovieByID);
// app.delete('/api/v1/movies/:id', deleteMovieByID);


//creating route as a middleware
// const moviesRouter=express.Router();
// moviesRouter.route('/')
//     .get(getAllMovie)
//     .post(createMovie)

// moviesRouter.route('/:id')
//     .get(getMovieByID)
//     .patch(updateMovieByID)
//     .delete(deleteMovieByID)

app.use('/api/v1/movies', moviesRouter);


// const port=4000;
// app.listen(port, ()=>{
//     console.log("Server has Started!");
// })

module.exports=app;