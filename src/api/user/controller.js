const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { DateTime } = require('luxon');
const uuidv4 = require('uuid/v4');
const User = require('./model');
const { env } = require('../../config');
const { jwtExpirationInterval, baseUrl } = require('../../config');

/**
 * Returns a formated object with tokens
 */

async function generateToken(user) {
  const refreshToken = uuidv4() + user._id;

  user.sessions = [
    ...user.sessions,
    {
      access_token: user.token(),
      refresh_token: refreshToken
    }
  ];
  user.save();

  const expiresIn = DateTime.local()
    .plus({ minutes: jwtExpirationInterval })
    .toSeconds();

  return {
    accessToken: user.token(),
    expiresIn,
    refreshToken
  };
}


/**
 * Login with an existing user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne(
      { email },
      {
        _id: 1,
        email: 1,
        password: 1,
        sessions: 1
      }
    );
    const passwordMatches = await user.passwordMatches(password);

    if (!user || !passwordMatches) {
      throw new Error('Credentials did not match');
    }

    const token = await generateToken(user);

    res.set('authorization', token.accessToken);
    res.set('x-refresh-token', token.refreshToken);
    res.set('x-token-expiry-time', token.expiresIn);
    res.status(httpStatus.OK);

    return res.json({
      token
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Creates a new user if valid details
 */

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      throw new Error('Email address is already exists.');
    }
    const token = uuidv4();

    await new User({
      email,
      password
    }).save();

    res.status(httpStatus.CREATED).json();
  } catch (error) {
    return next(error);
  }
};
