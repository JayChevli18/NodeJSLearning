const mongoose=require("mongoose");
const fs=require('fs');
const validator=require('validator');

const movieSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is Required!'],
        unique: true,
        trim:true,
        maxlength: [100, 'Movie name must not have more than 100 characters'],
        minlength: [2, 'Movie name must have at least 1 character'],
    },

    description: {
        type: String,
        required: [true, 'Description is required field!'],
    },

    duration:{
        type: Number,
        required: [true, 'Duration is required!'],
        validate: {
            validator: function(value){
                return Number.isInteger(value);
            },
            message: "Duration should be of Integer type!"
        }
    },
    ratings:{
        type: Number,
        // default: 1.0,
        min: [1, 'Ratings must be 1 or above'],
        max: [5, 'Ratings must be 5 or less']
    },
    totalRating:{
        type: Number,
        validate: {
            validator: function(value){
                return value >=1;
            },
            message: "Total Ratings should be greater than 0"
        }
    }, 
    releaseYear:{
        type: Number,
        required: [true, 'Release Year is required field!']
    },
    releaseDate:{
        type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false //This row will not get displayed in api response data
    },
    genres:{
        type: [String],
        required: [true, 'Genres is required field!'],
        enum:{
            values:['Action', 'Suspense', 'Thriller', 'Horror'],
            message: 'This genre does not exist!'
        }
    },
    directors:{
        type: [String],
        required: [true, 'Directors is required field!'],
    },
    coverImage:{
        type:String,
        required: [true, 'Cover Image is required field!']
    },
    actors:{
        type: [String],
        required: [true, 'Actors is required field!']
    },
    price:{
        type: Number,
        required: [true, 'Price is required!']
    },
    createdBy:{
        type: String,
    }


},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
})


//Document Middleware:
// Executed before document is saved in DB
//.save() or .create()
//insertMany, findByIdAndUpdate will not work

movieSchema.pre('save', function(next){
    this.createdBy='Jay',
    next();
})

//Executed After document is saved in DB
movieSchema.post('save', function(doc, next){
    const content=`A new movie document with name ${doc.name} is created by ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt', content, {flag:'a'}, (err)=>{
        console.log(err.message);
    });
    next();
})



//Query Middleware:
//for function that are starting with 'find' keyword

movieSchema.pre(/^find/, function(next){
    this.find({releaseDate:{$lte:Date.now()}});
    this.startTime=Date.now();
    next();
})

movieSchema.post(/^find/, function(docs, next){
    this.find({releaseDate:{$lte:Date.now()}});
    this.endTime=Date.now();

    const content=`Query took ${this.endTime-this.startTime} milliseconds to fetch documents\n`;
    fs.writeFileSync('./Log/log.txt', content, {flag:'a'}, (err)=>{
        console.log(err.message);
    })
    next();
})


//Aggregation Middleware
//unshift() - to keep that match at 0-index in array.
//add this whenever the aggregate event is called
movieSchema.pre('aggregate', function(next){
    console.log(this.pipeline().unshift({$match: {releaseDate:{$lte:new Date()}}}));
    next();
})


const Movie=mongoose.model('Movie', movieSchema);

module.exports=Movie;
