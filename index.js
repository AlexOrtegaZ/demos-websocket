
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
    var userID = req.url.substr(1);
    if (userID) {
      webSockets[userID] = webSocket
      console.log(`Use Connected: ${userID}. At: ${new Date().toISOString()}`);
    } else {
      console.log('Anonymus user connected');
    }

    webSocket.on('message', function(message) {
      console.log('received from ' + userID + ': ' + message);
      var messageBody = JSON.parse(message);
      if(messageBody.length > 0) {
        const [toUserId, message] = messageBody;
        console.log(toUserId, message);
        const toUserWebSocket = webSockets[toUserId]
        if (toUserWebSocket) {
          console.log('message sended to: ' + toUserId);
          toUserWebSocket.send(JSON.stringify(message))
        }
      }
    });
  
    webSocket.on('close', function () {
      delete webSockets[userID]
      console.log('deleted: ' + userID)
    });
  })


//start the web server
server.listen(serverPort, () => {
    console.log(`Websocket server started on port ` + serverPort);
});