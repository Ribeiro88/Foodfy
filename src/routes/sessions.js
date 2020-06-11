const express = require('express');
const routes = express.Router();

const { onlyUsers, loggedRedirectToProfile } = require('../app/middlewares/session');

const Validator = require('../app/validators/session');

const SessionController = require('../app/controllers/SessionController');


//Routes Login/Logout
routes.get("/login", loggedRedirectToProfile , SessionController.loginForm);
routes.post('/login', loggedRedirectToProfile, Validator.login, SessionController.login);
routes.post('/logout', onlyUsers, SessionController.logout);

//Routes Reset/Forgot
routes.get('/forgot_password', SessionController.forgotForm);
routes.post('/forgot_password', Validator.forgot, SessionController.forgot);

routes.get('/password_reset', SessionController.resetForm);
routes.post('/password_reset', Validator.reset, SessionController.reset);

module.exports = routes;