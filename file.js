const fs=require("fs");

console.log("first");

const fileContent=fs.readFileSync("./file.txt", "utf-8");
console.log(fileContent);

console.log("second");
fs.readFile("./file.txt", "utf-8", (err, data)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log(data);
    }
})

fs.writeFileSync("./greet.txt", "Hello World New");

fs.writeFile("./greet.txt", " Hello Jay!", {flag: "a"}, (err)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("file Write Success!");
    }
})

console.log("third");


