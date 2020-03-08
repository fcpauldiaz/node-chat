const express = require('express');
const controller = require('./controller');
const { authorize } = require('../../auth');

const routes = express.Router();

/**
 * {get} v1/user Get single user or list of users
 */

routes.route('/register').post(controller.register);

/**
 * {post} v1/user/login Login user
 */

routes.route('/login').post(controller.login);


module.exports = routes;
