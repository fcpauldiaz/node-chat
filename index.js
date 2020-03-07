const httpServer = require('http').createServer();
const { port, env } = require('./src/config');

const server = require('./src/server');
const database = require('./src/database');


database.connect();

server.listen(port, () => {
  console.info(`Server started on port ${port} (${env})`);
});

const src = server;

module.exports = src;
