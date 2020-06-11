const express = require('express');
const routes = express.Router();

const { onlyUsers, isAdmin } = require('../app/middlewares/session');
const Validator = require('../app/validators/user');

const UserController = require('../app/controllers/UserController');

//Routes Users

routes.get("/", isAdmin, UserController.allusers); 

routes.get('/register', UserController.registerForm);


routes.get('/user', onlyUsers, Validator.show, UserController.show);
routes.get("/:id/edit", isAdmin, Validator.edit, UserController.edit); 


routes.post('/', Validator.post, UserController.post);
routes.put('/', Validator.update, UserController.put)
routes.delete('/', UserController.delete);


module.exports = routes;