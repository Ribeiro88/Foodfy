const express = require('express');
const routes = express.Router();

const frontend = require('./frontend');
const recipes  = require('./recipes');
const chefs    = require('./chefs');
const users    = require('./users');
const sessions = require('./sessions');

routes.use("/", frontend);
routes.use("/admin/recipes", recipes);
routes.use("/admin/chefs", chefs);
routes.use("/admin/users", users);
routes.use("/sessions", sessions);

//Alias
routes.get("/admin", function(req, res){
    return res.redirect("/sessions/login");
});

module.exports = routes;