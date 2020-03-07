/** Default config will remain same in all environments and can be over-ridded */
let config = {
  baseUrl: 'http://localhost:3001',
  env: 'development',
  // JWT expiry time in minutes
  jwtExpirationInterval: 60 * 12,
  jwtSecret: 'qweqweuiquhjkdncjnzxncb12ne23h194y12u84134234h2j34h3',
  mongo: { uri: 'mongodb://127.0.0.1:27017/jobsity' },
  port: 3001,
  socketPort: 3002,
  socketUrl: 'localhost',
  website: 'http://localhost:3000',
};

module.exports = config;
