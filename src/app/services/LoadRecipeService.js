const Recipes = require("../models/Recipes");

async function getImages(recipeId) {
    let files = await Recipes.files(recipeId);

    files = files.map((file) => ({
        ...file,
        src: `${file.path.replace("public", "")}`,
    }));

    return files;
}

async function format(recipe) {
    const files = await getImages(recipe.id);
    
    recipe.img = files[0].src;
    recipe.images = files;

    return recipe;
}

const LoadService = {
    load(service, filter) {
        this.filter = filter;
        return this[service]();
    },
    
    async recipe() {
        try {
            const recipe = await Recipes.findOne(this.filter);
            return format(recipe);
        } catch (error) {
            console.error(error);
        }
    },
    
    async recipes() {
        const recipes = await Recipes.findAll(this.filter);
        const recipesPromise = recipes.map(format);
        return Promise.all(recipesPromise);
    },
    
    format,
};

module.exports = LoadService;