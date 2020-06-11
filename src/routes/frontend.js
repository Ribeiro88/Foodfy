const express = require('express');
const routes = express.Router();

const FrontController = require('../app/controllers/FrontController');

/*Routes Foodfy Front-end*/
routes.get("/", FrontController.index);
routes.get("/sobre", FrontController.sobre);
routes.get("/receitas", FrontController.receitas);
routes.get("/recipes/:id", FrontController.showRecipe);
routes.get("/searchrecipe", FrontController.receitas);
routes.get("/chefs", FrontController.chefs);
routes.get("/chefs/:id", FrontController.chef);

module.exports = routes;