const httpServer = require('http').createServer();
const { port, env, socketPort, socketUrl } = require('./src/config');

const server = require('./src/server');
const database = require('./src/database');
const socket = require('./src/socket');

global.io = require('socket.io').listen(httpServer);
socket.init();

database.connect();

server.listen(port, () => {
  console.info(`Server started on port ${port} (${env})`);
});

httpServer.listen(socketPort, socketUrl, () => {
  console.info(`Socket server started on ${socketUrl}:${socketPort}(${env})`);
});

const src = server;

module.exports = src;
