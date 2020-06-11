const Recipes = require('../models/Recipes');
const Recipes_files = require('../models/Recipes_files');
const Chefs = require('../models/Chefs');

const LoadRecipeService = require('../services/LoadRecipeService');
const LoadChefService = require('../services/LoadChefService');

module.exports = {
    async index(req, res) {
        try {
            const allRecipes = await LoadRecipeService.load("recipes");
            const recipes = allRecipes.filter((recipe, index) => index > 5 ? false : true);
            return res.render("index", { recipes });
        } catch (error) {
            console.error(error);
        }
    },
    
    sobre(req, res) {
        return res.render("sobre");
    },
    
    async receitas(req, res) {
        try {
            let { filter, page, limit } = req.query;

            page = page || 1;
            limit = limit || 6;
            let offset = limit * (page - 1);

            const params = { filter, page, limit, offset };

            let recipes = await Recipes.paginate(params);
            if (recipes[0] == undefined) return res.render("receitas", { filter });

            const recipesPromise = recipes.map(async recipe => {
                const files = await Recipes_files.files(recipe.id);
                if (files[0]) recipe.img = files[0].path.replace("public", "");
            });

            await Promise.all(recipesPromise);

            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page,
                filter
            };

            return res.render("receitas", { recipes, pagination, filter });

        } catch (error) {
            console.error(error);
        }
    },
    
    async showRecipe(req, res) {
        try {
            const recipe = await LoadRecipeService.load("recipe", req.params.id);
            if (!recipe) return res.send('Receita não encontrada!');            
            return res.render("recipes", { recipe });
        } catch (error) {
            console.error(error);
        }
    },
    
    async chefs(req, res) {
        try {
            const chefs = await LoadChefService.load("chefs");
            return res.render("chefs", { chefs });
        } catch (error) {
            console.error(error);
        }
    },
    
    async chef(req, res) {
        try {
            let chef = await LoadChefService.load("chef", req.params.id);
            if (!chef) return res.send('Chef não encontrado!');  
    
            let image = await Chefs.files(chef.id);
            if (image[0]) image.src = image[0].path.replace("public", "");
    
            const recipes = await LoadChefService.load("recipes");
            return res.render("chefs", { chef, image, recipes });
            
        } catch (error) {
            console.error(error);
        }
    }
};