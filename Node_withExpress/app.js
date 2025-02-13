const express=require("express");
// const fs=require("fs");
const morgan = require("morgan");
const mongoose=require("mongoose");
const moviesRouter=require('./Routes/moviesRoutes');
const dotenv=require("dotenv");
const CustomError = require("./utils/CustomError");
const globalErrorHandler=require('./Controllers/errorController');
const authRouter=require('./Routes/authRoutes');
const userRouter=require('./Routes/userRoutes');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const sanitize=require('express-mongo-sanitize');
const hpp=require('hpp');

dotenv.config();

mongoose.connect(process.env.MONGOURL,{
    useNewUrlParser:true
}).then((conn)=>console.log("conn"))
// .catch((err)=>{console.log("errpr", err)});


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


//Added Data Santization Middleware
//It will not allow data which contain . or $.
//It will not allow nosql query which are passed in request body.
app.use(sanitize());


//Preventing Parameter Pollution
//hpp - http parameter pollution
//This is used when I want to pass same query string more than one.
//for example: http://localhost:4000/api/v1/movies?sort=price&sort=ratings
//Here duration is passed twice. So this hpp will allow me. If don't use this then it will throw an error.
app.use(hpp());


//Added Helmet for Security
//It will add more number of Headers for security purpose
app.use(helmet());



//Rate Limiter
let limiter=rateLimit({
    max:3,
    windowMs: 5*60*1000,
    message: 'We had received too many requests from this IP. Please try after 5 minutes'
});
app.use('/api', limiter);


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

//Auth Route:
app.use('/api/v1/auth', authRouter);

//User Route:
app.use('/api/v1/users', userRouter);

//Default Route - Error Handling
app.all('*', (req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // });    

    // const err=new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.status="fail",
    // err.statusCode=404;

    const err=new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);

    next(err);//If you pass anything as a parameter in next() function, then it will take it as error and then pass the function to the global error handler.
})


//Global Error Handling
//all the next(100), next(err) will call this global error handler as it has 'error' as an argument.
//Added this below code to errorController.js file
// app.use((error, req,res,next)=>{
//     error.statusCode=error.statusCode || 500;
//     error.status=error.status || 'error';
//     res.status(error.statusCode).json({
//         status:error.statusCode,
//         message:error.message
//     });
// });
// From errorController:
app.use(globalErrorHandler);


// const port=4000;
// app.listen(port, ()=>{
//     console.log("Server has Started!");
// })

module.exports=app;