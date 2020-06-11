const { unlinkSync } = require('fs');

const Recipes = require('../models/Recipes');
const Chefs = require('../models/Chefs');
const File = require('../models/File');
const Recipes_files = require('../models/Recipes_files');

const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
    async admin(req, res) {
        try {
            let recipes = await LoadRecipeService.load("recipes");
            return res.render("admin/recipes/index", { recipes });
        } catch (error) {
            console.error(error);
        }
    },
    async create(req, res) {
        try {
            const chefs = await Chefs.findAll();
            res.render("admin/recipes/create", { chefs });
        } catch (error) {
            console.error(error);
        }
    },
    
    async post(req, res) {
        try {
            let { chef, title, ingredients, preparation, information } = req.body;

            const { userId } = req.session;

            const recipeId = await Recipes.create({
                chef_id: chef,
                user_id: req.session.userId,
                title,
                ingredients,
                preparation,
                information,
                user_id: userId
            });

           

            const filesPromise = req.files.map((file) => File.create({ name: file.filename, path: file.path }));
            const filesId = await Promise.all(filesPromise);
            
            const relationPromise = filesId.map((fileId) => Recipes_files.create({ recipe_id: recipeId, file_id: fileId }));
            await Promise.all(relationPromise);

            return res.redirect(`/admin/recipes/${recipeId}`);

        } catch (error) {
            console.error(error);
        }
    },
    
    async show(req, res) {
        try {
            //const { recipe } = req
            const recipe = await LoadRecipeService.load("recipe", req.params.id);
            if (!recipe) return res.send('Receita não encontrada!');  
            return res.render("admin/recipes/show", { recipe });
        } catch (error) {
            console.error(error);
        }
    },
    
    async edit(req, res) {
        try {
            //const { recipe } = req
            const recipe = await LoadRecipeService.load("recipe", req.params.id);
            if (!recipe) return res.send('Receita não encontrada!');  

            const chefs = await Chefs.findAll();
            return res.render("admin/recipes/edit", { recipe, chefs });

        } catch (error) {
        console.error(error);
        }
    },
    
    async put(req, res) {
        try {
            let { chef, title, ingredients, preparation, information } = req.body;
            
            if (req.files.length != 0) {
                const newFilesPromise = req.files.map((file) => File.create({ name: file.filename, path: file.path }));
                const filesId = await Promise.all(newFilesPromise);

                const relationPromise = filesId.map((fileId) => Recipes_files.create({ recipe_id: req.body.id, file_id: fileId }));
                await Promise.all(relationPromise);
            }

            if (req.body.removed_files) {
                const removedFiles = fields.removed_files.split(",");
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);

                const removedFilesPromise = removedFiles.map(async (id) => {
                    try {
                        const file = await File.findOne({ where: { id }});
                        File.delete(id);
                        unlinkSync(file.path);
                    } catch (error) {
                        console.error(error);
                    }
                });

                await Promise.all(removedFilesPromise);
            }

            await Recipes.update(req.body.id, {
                chef_id: chef,
                title,
                ingredients,
                preparation,
                information
            });

            req.session.success = "Receita alterada com sucesso!";
            return res.redirect(`/admin/recipes/${req.body.id}`);

        } catch (error) {
        console.error(error);
        }
    },
    
    async delete(req, res) {
        try {
            const files = await Recipes.files(req.body.id);
            await Recipes.delete(req.body.id);

            files.map((file) => {
                try {
                    File.delete(file.file_id);
                    unlinkSync(file.path);
                } catch (error) {
                    console.error(error);
                }
            });

            req.session.success = "Receita deletada com sucesso!";
            return res.redirect("/admin/recipes");

        } catch (error) {
            console.error(error);
        }
    }
};