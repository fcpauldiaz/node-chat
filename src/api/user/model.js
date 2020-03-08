const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { DateTime } = require('luxon');
const jwt = require('jwt-simple');
const {
  env, jwtSecret, jwtExpirationInterval,
} = require('../../config');

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  sessions: [
    {
      access_token: { type: String },
      refresh_token: { type: String },
      socket_id: { type: String },
    },
  ],
});

userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = env === 'development' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);

    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  async passwordMatches(password) {
    const result = await bcrypt.compare(password, this.password);

    return result;
  },
  token() {
    const date = DateTime.local();
    const payload = {
      _id: this._id,
      exp: date.plus({ minutes: jwtExpirationInterval }).toSeconds(),
      iat: date.toSeconds(),
    };

    return jwt.encode(payload, jwtSecret);
  },
});

const model = mongoose.model('User', userSchema);

model.createIndexes({
  email: 1,
});

module.exports = model;
