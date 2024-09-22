const cluster=require("node:cluster");
const os=require("node:os");
const http=require("node:http");

console.log(os.cpus().length);

if(cluster.isMaster){
    console.log(`Master process ${process.pid} is running.`);
    cluster.fork();
    cluster.fork();
}
else{
    console.log(`Worker process ${process.pid} started`);
    const server=http.createServer((req, res)=>{
        if(req.url==='/'){
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.end("Home Page");
        }
        else if(req.url==='/slow'){
            for(let i=0;i<8000000000;i++){
            }
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.end("Slow Page");
        }
    });
    
    server.listen(3000, ()=>{console.log("Server is running on port")});
    
}

