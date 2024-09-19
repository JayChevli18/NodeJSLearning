const buffer=new Buffer.from("Jay1234");

buffer.write("Chevli");

console.log(buffer.toString());
console.log(buffer);
console.log(buffer.toJSON());