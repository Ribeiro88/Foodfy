const Chefs = require("../models/Chefs");
const Recipes = require("../models/Recipes");

async function getImages(chefId) {
    let files = await Chefs.files(chefId);
    
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }));

    return files;
}

async function format(chef) {
    const files = await getImages(chef.id);

    chef.img = files[0].src;
    chef.images = files;

    return chef;
}

const LoadService = {
    load(service, filter) {
        this.filter = filter;
        return this[service]();
    },
    
    async chef() {
        try {
            const chef = await Chefs.findOne(this.filter);
            return format(chef);
        } catch (error) {
            console.error(error);
        }
    },
    
    async chefs() {
        const chefs = await Chefs.findAll(this.filter);
        const chefsPromise = chefs.map(format);
        return Promise.all(chefsPromise);
    },
    
    async recipes() {
        const recipes = await Chefs.recipes();

        const itemsPromise = recipes.map(async recipe => {
            const files = await Recipes.files(recipe.id);
            if (files[0]) recipe.src = files[0].path.replace("public", "");
        });

        await Promise.all(itemsPromise);
        return recipes;
    },
    
    format
};

module.exports = LoadService;