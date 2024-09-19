const EventEmitter=require("node:events");

const emitter=new EventEmitter();

emitter.on("order-pizza",(size, topping)=>{
    console.log(1)
})


