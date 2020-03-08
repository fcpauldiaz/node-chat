/** Default config will remain same in all environments and can be over-ridded */
let config = {
  baseUrl: 'http://localhost:3001',
  env: 'development',
  // JWT expiry time in minutes
  jwtExpirationInterval: 60 * 12,
  jwtSecret: 'ASDFGHJKLIOMNOPQRSTUVWXYZ',
  mongo: { uri: 'mongodb://127.0.0.1:27017/jobsity' },
  port: 3001,
  socketPort: 3002,
  socketUrl: 'localhost',
};

module.exports = config;
