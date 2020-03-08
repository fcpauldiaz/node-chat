const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const { DateTime } = require('luxon');
const User = require('./api/user/model');
const { jwtSecret } = require('./config');

const authorize = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const apiError = new Error('Unauthorized');

    if (!authorization) {
      return next(apiError);
    }

    const token = authorization.split(' ')[1];

    try {
      const tokenResult = jwt.decode(token, jwtSecret);

      if (!tokenResult || !tokenResult.exp || !tokenResult._id) {
        apiError.message = 'Malformed Token';

        await User.findOneAndUpdate(
          { 'sessions.access_token': token },
          { $pull: { sessions: { access_token: token } } }
        );

        return next(apiError);
      }

      if (tokenResult.exp - DateTime.local().toSeconds() < 0) {
        apiError.message = 'Token Expired';

        await User.findOneAndUpdate(
          { 'sessions.access_token': token },
          { $pull: { sessions: { access_token: token } } }
        );

        return next(apiError);
      }

      const user = await User.findById(tokenResult._id).lean();

      if (!user) {
        return next(apiError);
      }

      req.user = user;

      return next();
    } catch (e) {
      apiError.message = 'Token Expired';

      return next(apiError);
    }
  } catch (e) {
    return next(
      new Error(httpStatus[500])
    );
  }
};

exports.authorize = (roles = User.roles) => (req, res, next) => authorize(req, res, next, roles);
