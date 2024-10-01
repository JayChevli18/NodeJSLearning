const fs=require('fs');
const http=require('http');

const server=http.createServer();

server.on('request', (req, res)=>{
    let rs=fs.createReadStream('./Files/large-file.txt');
    rs.pipe(res);
})
//console.log("c");

server.listen(4000, () => {
    console.log("Server Started at port 4000");
})

