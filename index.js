
/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

"use strict";

const serverPort = 5003;
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