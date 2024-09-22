const http=require("node:http");
const {Worker}=require("node:worker_threads");


const server=http.createServer((req, res)=>{
    if(req.url==='/'){
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.end("Home Page");
    }
    else if(req.url==='/slow'){
        const worker=new Worker("./worker-thread.js");
        worker.on("message", (j)=>{
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.end(`Slow Page ${j}`);    
        })
    }
});

server.listen(3000, ()=>{console.log("Server is running on port")});
