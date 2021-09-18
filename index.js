
"use strict";

const serverPort = 5000;
const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });
const webSockets = {};

webSocketServer.on('connection', function (webSocket, req) {
    var userID = req.url.substr(1)
    webSockets[userID] = webSocket
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(webSockets))

    webSocket.on('message', function(message) {
      console.log('received from ' + userID + ': ' + message)
      var messageArray = JSON.parse(message)
      var toUserWebSocket = webSockets[messageArray[0]]
      if (toUserWebSocket) {
        console.log('sent to ' + messageArray[0] + ': ' + JSON.stringify(messageArray))
        messageArray[0] = userID
        toUserWebSocket.send(JSON.stringify(messageArray))
      }
    })
  
    webSocket.on('close', function () {
      delete webSockets[userID]
      console.log('deleted: ' + userID)
    })
  })


//start the web server
server.listen(serverPort, () => {
    console.log(`Websocket server started on port ` + serverPort);
});