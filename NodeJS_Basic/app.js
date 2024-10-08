const readline = require('readline');
const fs = require('fs');
const http = require('http');
const url = require('url');
const events = require('events');


const replaceHTML = require('./Modules/replaceHTML');
const user=require('./Modules/user');


const html = fs.readFileSync('./Template/index.html', 'utf-8');
let products = JSON.parse(fs.readFileSync('./Data/products.json', 'utf-8'));
let productListHtml = fs.readFileSync('./Template/product-list.html', 'utf-8');
let productDetailHTML = fs.readFileSync('./Template/product-details.html', 'utf-8');

// let productHtmlArray = products.map((prod) => {
//     let output = productListHtml.replace('{{%IMAGE%}}', prod.productImage);
//     output = output.replace('{{%NAME%}}', prod.name);
//     output = output.replace('{{%MODELNAME%}}', prod.modeName);
//     output = output.replace('{{%MODELNO%}}', prod.modelNumber);
//     output = output.replace('{{%SIZE%}}', prod.size);
//     output = output.replace('{{%CAMERA%}}', prod.camera);
//     output = output.replace('{{%PRICE%}}', prod.price);
//     output = output.replace('{{%COLOR%}}', prod.color);
//     output = output.replace('{{%ID%}}', prod.id);
//     return output;
// })

// function replaceHTML(template, product) {
//     let output = template.replace('{{%IMAGE%}}', product.productImage);
//     output = output.replace('{{%NAME%}}', product.name);
//     output = output.replace('{{%MODELNAME%}}', product.modeName);
//     output = output.replace('{{%MODELNO%}}', product.modelNumber);
//     output = output.replace('{{%SIZE%}}', product.size);
//     output = output.replace('{{%CAMERA%}}', product.camera);
//     output = output.replace('{{%PRICE%}}', product.price);
//     output = output.replace('{{%COLOR%}}', product.color);
//     output = output.replace('{{%ID%}}', product.id);
//     output=output.replace('{{%DESC%}}', product.Description);
//     return output;
// }


//Without Event Driven Architecture:
// const server = http.createServer((req, res) => {

//     let { query, pathname: path } = url.parse(req.url, true);


//     //    let path=req.url;

//     if (path === '/' || path.toLocaleLowerCase() === '/home') {
//         res.writeHead(200, {
//             'Content-Type': 'text/html',
//             'my-header': 'Hello world'
//         });
//         res.end(html.replace('{{%CONTENT%}}', productListHtml));
//     }
//     else if (path.toLocaleLowerCase() === '/about') {
//         res.writeHead(200, {
//             'Content-Type': 'text/html',
//             'my-header': 'Hello world'
//         });
//         res.end(html.replace('{{%CONTENT%}}', 'You are in ABOUT page'));
//     }
//     else if (path.toLocaleLowerCase() === '/contact') {
//         res.writeHead(200, {
//             'Content-Type': 'text/html',
//             'my-header': 'Hello world'
//         });
//         res.end(html.replace('{{%CONTENT%}}', 'You are in Contact page'));
//     }
//     else if (path.toLocaleLowerCase() === '/products') {
//         if (!query.id) {
//             let productHtmlArray = products.map((prod) => {
//                 return replaceHTML(productListHtml, prod);
//             })
//             let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(','));
//             res.writeHead(200, {
//                 'Content-type': 'text/html'
//             })
//             res.end(productResponseHtml);
//         }
//         else {
//             let prod=products[query.id];
//             let productDetailsResponseHTML=replaceHTML(productDetailHTML, prod);
//             res.end(html.replace('{{%CONTENT%}}', productDetailsResponseHTML));
//         }
//     }
//     else {
//         res.writeHead(404, {
//             'Content-Type': 'text/html',
//             'my-header': 'Hello world!'
//         })
//         res.end(html.replace('{{%CONTENT%}}', 'Error 404: Page Not Found'))
//     }

// })

//With Event Driven Architecture:
const server = http.createServer();

server.on('request', (req, res) => {

    let { query, pathname: path } = url.parse(req.url, true);

    if (path === '/' || path.toLocaleLowerCase() === '/home') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Hello world'
        });
        res.end(html.replace('{{%CONTENT%}}', productListHtml));
    }
    else if (path.toLocaleLowerCase() === '/about') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Hello world'
        });
        res.end(html.replace('{{%CONTENT%}}', 'You are in ABOUT page'));
    }
    else if (path.toLocaleLowerCase() === '/contact') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Hello world'
        });
        res.end(html.replace('{{%CONTENT%}}', 'You are in Contact page'));
    }
    else if (path.toLocaleLowerCase() === '/products') {
        if (!query.id) {
            let productHtmlArray = products.map((prod) => {
                return replaceHTML(productListHtml, prod);
            })
            let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(','));
            res.writeHead(200, {
                'Content-type': 'text/html'
            })
            res.end(productResponseHtml);
        }
        else {
            let prod = products[query.id];
            let productDetailsResponseHTML = replaceHTML(productDetailHTML, prod);
            res.end(html.replace('{{%CONTENT%}}', productDetailsResponseHTML));
        }
    }
    else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-header': 'Hello world!'
        })
        res.end(html.replace('{{%CONTENT%}}', 'Error 404: Page Not Found'))
    }

})


server.listen(4000, () => {
    console.log("Server Started at port 4000");
})


//Emitting & Handling Custom Events

let myEmitter=new user();

myEmitter.on('userCreated', (id, name)=>{
    console.log(`User: ${name}, ID: ${id}`);
})

myEmitter.on('userCreated', (id, name)=>{
    console.log(`New Event:- User: ${name}, ID: ${id}`);
})

myEmitter.emit('userCreated', 101,'Om');