const express = require('express');
const routes = express.Router();

const { onlyUsers, isAdmin } = require('../app/middlewares/session');
const multer = require('../app/middlewares/multer');

const Validator = require('../app/validators/chefs');
const ChefsController = require('../app/controllers/ChefsController');

/*Routes Chefs*/ 
routes.get("/", onlyUsers, ChefsController.admin); 
routes.get("/create", isAdmin, ChefsController.create); 
routes.get("/:id", onlyUsers, ChefsController.show);
routes.get("/:id/edit", isAdmin, ChefsController.edit);

routes.post("/", multer.single("avatar", 1), Validator.post, ChefsController.post); 
routes.put("/",  multer.single("avatar", 1), isAdmin, Validator.update, ChefsController.put); 
routes.delete("/", ChefsController.delete); 

module.exports = routes;