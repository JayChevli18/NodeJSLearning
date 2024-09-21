const fs=require("node:fs/promises");

const func=async ()=>{
    try{
        const data=await fs.readFile("file.txt", "utf-8");
        console.log(data);
    }
    catch(err){
        console.log(err);
    }
}

func();