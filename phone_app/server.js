const express = require("express");
const http = require('http');
var https = require('https');
var fs = require('fs');

const path = require('path');
const app = express();
const { ExpressPeerServer } = require('peer');

const port = process.env.PORT || "80";
var privateKey  = fs.readFileSync('./sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const server = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

const peerServer = ExpressPeerServer(server, {
    proxied: true,
    debug: true,
    path: '/myapp',
    ssl: {}
});

app.use(peerServer);

app.use(express.static(path.join(__dirname)));

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

server.listen(port);
httpsServer.listen(8001, function(){
    console.log("server running at https://IP_ADDRESS:8001/")
});
console.log('Listening on: ' + port);


