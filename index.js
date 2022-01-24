

// Blocking, synchronous way
// const day = new Date().getUTCDate()
// const textIn = fs.readFileSync('./input.txt', 'utf-8')
// console.log(textIn);
// const textOut = 'this is wht we know about the avocado' + textIn +
//     'create on ' + day
// fs.writeFileSync('./input.txt', textOut)
// console.log('File Writtne!')


// Non-blocking asynchronous way

// fs.readFile('./input.txt', 'utf-8', (err, text) => {
//     console.log(text)
// })


// fs.readFile('./input.txt', 'utf-8', (err, text) => {
//     fs.write('./newInput.txt', text, 'utf-8', err => {
//         console.log('teste')
//     });
// })

const fs = require('fs');
const http = require('http');
const url = require('url');

// Server
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    const pathName = req.url;

    // Overview page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(
            el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output);

        // Product page
    } else if (pathName === '/product') {
        res.end('hello from the product !!');

        // API
    } else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)

        // Not Found
    }
    else {
        res.writeHead(404,
            {
                'content-type': 'text/html',
                'my-own-header': 'hello-world'
            });


        res.end('<h1>server not found</h1>')
    }

});

server.listen(8000, '127.0.0.1', () => {
    console.log('server on')
})