function greet(name){
    console.log(`Hello ${name}`);
}

function higherOrderFunction(callback){
    const name="jay";
    callback(name);
}

higherOrderFunction(greet);
