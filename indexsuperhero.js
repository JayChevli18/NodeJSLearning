//Module Caching

const superhero=require("./superhero");

const spiderman=new superhero("spiderman");
console.log(spiderman.getName());

spiderman.setName("Peter");
console.log(spiderman.getName());
