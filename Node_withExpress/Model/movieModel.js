const mongoose=require("mongoose");

const movieSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is Required!'],
        unique: true
    },

    description: String,

    duration:{
        type: Number,
        required: [true, 'Duration is required!']
    },
    ratings:{
        type: Number,
        default: 1.0
    } 
});

const Movie=mongoose.model('Movie', movieSchema);

module.exports=Movie;
