const http=require("node:http");
const fs=require("node:fs");

// const server=http.createServer((req,res)=>{
//     res.writeHead(200,{"Content-Type":"text/plain"});
//     res.end("Hello World");
// });

// const server=http.createServer((req, res)=>{
//     const book={
//         id:"B12",
//         name:"Life of PI"
//     }

//     res.writeHead(200, {"Content-Type":"application/json"});
//     res.end(JSON.stringify(book));
// })

// const server=http.createServer((req, res)=>{
//     res.writeHead(200,{"Content-Type":"text/html"});
//     fs.createReadStream(__dirname+"/http_index.html").pipe(res);
//     // const html=fs.readFileSync("./http_index.html", "utf-8");
//     // res.end(html);
// })

const server=http.createServer((req,res)=>{
    const name="Jay";
    res.writeHead(200,{"Content-Type":"text/html"});

    let html=fs.readFileSync("./http_index.html", "utf-8");
    html=html.replace("{{name}}", name);
    res.end(html);
})

server.listen(3000,()=>{
    console.log("Server running on Port 3000");
})
