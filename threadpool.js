const crypto=require("node:crypto");
const https=require("node:https");



const start=Date.now();

//pbkdf2 - password based key derivation function 2 - This allow us to Hash Password before storing them
//This is a CPU intensive method which will take long time ans is offloaded to thread pool
crypto.pbkdf2Sync("password","salt",100000,512, "sha512");
crypto.pbkdf2Sync("password","salt",100000,512, "sha512");
crypto.pbkdf2Sync("password","salt",100000,512, "sha512");


console.log("Hash: ", Date.now()-start);


const start1=Date.now();

process.env.UV_THREADPOOL_SIZE=4;// increase the thread pool size i.e. creating more number of threads
const call=4;
for(let i=0;i<call;i++)
{
    crypto.pbkdf2("password", "salt", 100000,512,"sha512",()=>{
        console.log(`Hash: ${i+1}`, Date.now()-start);
    });
}

const start3=Date.now();

for(let i=0;i<call;i++){
    https.request("https://www.google.com",(res)=>{
        res.on("data", ()=>{});
        res.on("end", ()=>{
            console.log(`Request: ${i+1}`, Date.now()-start3);
        });
    })
    .end();
}