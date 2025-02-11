const app=require('./app.js');

const port=4000;
const serverObj=app.listen(port, ()=>{
    console.log("Server has Started!");
})

//Handling Rejected Promise Globally
//All unhandled rejected promise will execute this function.
process.on('unhandledRejection', (err)=>{
    console.log(err.name, err.message);
    console.log('Unhandled rejection occured! Shutting down...');

    serverObj.close(()=>{
        process.exit(1);
    })
})

