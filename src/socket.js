const httpStatus = require('http-status');
const User = require('./api/user/model');
const bot = require('./api/bot/controller');

const authentication = async (data, socketId) => {
  try {
    let user = await User.findOne({ 'sessions.refresh_token': data.token });
    if (user) {
      user = await User.findOneAndUpdate(
        { 'sessions.refresh_token': data.token },
        { $set: { 'sessions.$.socket_id': socketId } },
        { new: true }
      );
    }

    return user;
  } catch (err) {
    throw new Error('Unauthorized');
  }
};

// in memory temporal storage
const messages = [];

const storeMessage = (user, message, timestamp) => {
  messages.push({
    user,
    message,
    timestamp
  });

  // 50 max messages
  if (messages.length > 50) {
    messages.shift();
  }
  // sort by timestamp
  messages.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
};

exports.init = async () => {
  global.io.on('connection', async socket => {
    const query = socket.request._query;
    authentication(query, socket.id)
      .then(result => {
        if (result) {
          socket.user = result;
          global.io.to(socket.id).emit('onAuthenticated', true);
          global.io.emit('onUserOnline', result);
          // show history of messages
          messages.forEach((message)=> {
            global.io.emit('message', message);
          });
          return;
        }

        global.io.to(socket.id).emit('onAuthenticated', false);
        global.io.sockets.sockets[socket.id].disconnect();
      })
      .catch(() => {});
    socket.on('message', async message => {
      let user = socket.user.email;
      if (message.includes('/stock=')) {
        const ticker = message.substring(message.indexOf('=')+1, message.length);
        message = await bot.stock(ticker);
        user = 'bot';
      }
      const timestamp = new Date();
      storeMessage(user, message, timestamp);
      global.io.emit('message', { user , message });
    });
  });
};
