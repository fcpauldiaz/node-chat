const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./api/router');


const corsOptions = {
  exposedHeaders: 'authorization, x-refresh-token, x-token-expiry-time',
};

/**
 * Express instance
 * @public
 */

const server = express();

// parse body params and attache them to req.body
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
server.use(compress());

// secure servers by setting various HTTP headers
server.use(helmet());

// enable CORS - Cross Origin Resource Sharing
server.use(cors(corsOptions));

// client side main view
server.get('/', (req, res) => {
  res.render('index.ejs');
});

// client side chat view
server.get('/chat', (req, res) => {
  res.render('chat.ejs');
});


// mount api v1 routes
server.use('/api/v1', routes);

server.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(500).json({
    message: err.message,
    stack:  err.stack,
  })
);

module.exports = server;
