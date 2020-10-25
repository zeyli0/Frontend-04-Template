const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.log(err)
  }).on('data', (chunk) => {
    body.push(chunk.toString())
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log("body", body);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`
    <html maaa=a >
    <head>
    <style>
    #container {
      width: 500px;
      height: 300px;
      dispaly: flex;
      background-color: rgb(255, 255, 255);
    }
    #container #myid{
      width: 200px;
      height: 100px;
      background-color: blue;
    }
    #container .c1 {
      flex:1 ;
      background-color: rgba(0, 255, 0);
    }
    </style>
    </head>
    <body style="background-color: rgb(0,0,0)">
    <div id="container">
      <div id="myid"></div>
      <div class="c1"></div>
    </div>
    </body>
    </html>\n`);
  })
}).listen(8088)

console.log('server started');
