const readline = require('readline');
const fs = require('fs');
const http = require('http');
const url = require('url');
const events = require('events');

const html = fs.readFileSync('./Template/index.html', 'utf-8');
let products = JSON.parse(fs.readFileSync('./Data/products.json', 'utf-8'));
let productListHtml = fs.readFileSync('./Template/product-list.html', 'utf-8');

let productHtmlArray = products.map((prod) => {
    let output = productListHtml.replace('{{%IMAGE%}}', prod.productImage);
    output = output.replace('{{%NAME%}}', prod.name);
    output = output.replace('{{%MODELNAME%}}', prod.modeName);
    output = output.replace('{{%MODELNO%}}', prod.modelNumber);
    output = output.replace('{{%SIZE%}}', prod.size);
    output = output.replace('{{%CAMERA%}}', prod.camera);
    output = output.replace('{{%PRICE%}}', prod.price);
    output = output.replace('{{%COLOR%}}', prod.color);
    output = output.replace('{{%ID%}}', prod.id);
    return output;
})

const server = http.createServer((req, res) => {

    let { query, pathname: path } = url.parse(req.url, true);


    //    let path=req.url;

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
            let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(','));
            res.writeHead(200, {
                'Content-type': 'text/html'
            })
            res.end(productResponseHtml);
        }
        else{
            res.end('This is a product with ID: '+query.id);
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