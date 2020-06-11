const express = require('express');
const routes = express.Router();

const { onlyUsers, isAdmin } = require('../app/middlewares/session');
const multer = require('../app/middlewares/multer');

const Validator = require('../app/validators/recipes');
const RecipesController = require('../app/controllers/RecipesController');

/*Routes Recipes*/ 
routes.get("/", onlyUsers, RecipesController.admin); 
routes.get("/create", onlyUsers, RecipesController.create); 
routes.get("/:id",  onlyUsers, RecipesController.show);
routes.get("/:id/edit", isAdmin, RecipesController.edit); 

routes.post("/", multer.array("fotos", 5), Validator.post, RecipesController.post); 
routes.put("/", multer.array("fotos", 5), isAdmin, Validator.update, RecipesController.put); 
routes.delete("/",  RecipesController.delete); 


module.exports = routes;