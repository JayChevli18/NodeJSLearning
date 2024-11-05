const fs=require("fs");
let movies=JSON.parse(fs.readFileSync("./data/movies.json"));


exports.getAllMovie=(req, res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        requestedAt:req.requestedAt,
        data:{
            movies:movies
        }
    })
}

exports.createMovie=(req, res)=>{
    const newId=movies[movies.length-1].id+1;
    const newMovie=Object.assign({id:newId}, req.body);

    movies.push(newMovie);

    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err)=>{
        res.status(201).json({
            status:"success",
            data:{
                movie:newMovie
            }
        })
    })
}


exports.getMovieByID=(req, res)=>{
    const id=req.params.id*1;

    let movie=movies.find(el=>el.id===id);

    if(!movie){
        return res.status(404).json({
            status:"fail",
            message:`Movie with ID ${id} not Found!`
        })
    }

    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })
}

exports.updateMovieByID=(req, res)=>{
    let id=req.params.id*1;
    let movieUpdate=movies.find(el=>el.id===id);

    if(!movieUpdate){
        res.status(404).json({
            status:"fail",
            message:`No movie with ID: ${id} is founnd!`
        })
    }

    let index=movies.indexOf(movieUpdate);

    Object.assign(movieUpdate, req.body);

    movies[index]=movieUpdate;

    fs.writeFile('./data/movies.json', JSON.stringify(movies),(err)=>{
        res.status(200).json({
            status:"success",
            data:{
                movie:movieUpdate
            }
        })
    })

}

exports.deleteMovieByID=(req,res)=>{
    let id=req.params.id*1;
    const movieToDelete=movies.find(el=>el.id===id);
    const index=movies.indexOf(movieToDelete);

    if(!movieToDelete){
        res.status(404).json({
            status:"fail",
            message:`No movie with ID: ${id} is founnd!`
        })
    }


    movies.splice(index,1);
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
        res.status(204).json({
            status:"success",
            data:{
                movie:null
            }
        })
    })

}
