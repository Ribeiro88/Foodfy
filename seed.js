const { hash } = require('bcryptjs');
const faker = require('faker');

const Users = require('./src/app/models/User');
const Chefs = require('./src/app/models/Chefs');
const Recipes = require('./src/app/models/Recipes');
const File = require('./src/app/models/File');
const Recipes_files = require('./src/app/models/Recipes_files');

let IdUsers = [],
    IdChefs = [],
    IdRecipes = [];

const maxUsers = 2;
const maxChefs = 9;
const maxRecipes = 9;

async function createUsers() {
    const users = [];
    const password = await hash("123456", 8);

    while (users.length < maxUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
        });
    }

    users[0].is_admin = 1
    users[1].is_admin = 0


    const usersPromise = users.map(user => Users.create(user));
    IdUsers = await Promise.all(usersPromise);
}

async function createChefs() {
    let files = [],
        chefs = [],
        i = 0;

    while (files.length < maxChefs) {
        files.push({
            name: faker.name.firstName(),
            path: `public/images/fake-img.png`
        });
    }

    const filesPromise = files.map(file => File.create(file));
    filesIds = await Promise.all(filesPromise);

    while (chefs.length < maxChefs) {
        chefs.push({
            name: faker.name.firstName(),
            file_id: filesIds[i]
        });

        i += 1;
    }

    const chefsPromise = chefs.map(chef => Chefs.create(chef));
    IdChefs = await Promise.all(chefsPromise);
}

async function createRecipes() {
    let recipes = [],
        files = [];
    
    while (recipes.length < maxRecipes) {
        recipes.push({
            chef_id: IdChefs[Math.floor(Math.random() * maxChefs)],
            user_id: IdUsers[Math.floor(Math.random() * maxUsers)],
            title: faker.name.title(),
            ingredients: faker.lorem.paragraph(1).split(' '),
            preparation: faker.lorem.paragraph(1).split(' '),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 5))
        });
    }
  
    const recipesPromise = recipes.map(recipe => Recipes.create(recipe));
    IdRecipes = await Promise.all(recipesPromise);
    
    while (files.length < maxRecipes) {
        files.push({
            name: faker.commerce.productName(),
            path: `public/images/fake-img.png`
        });
    }
  
    const filesPromise = files.map(file => File.create(file));
    recipesImages = await Promise.all(filesPromise);
}
  
async function createRecipeFile() {
    let recipeFiles = [];
    let i = 0;
  
    while (recipeFiles.length < maxRecipes) {
        recipeFiles.push({
            recipe_id: IdRecipes[i],
            file_id: recipesImages[i]
        });

        i += 1;
    }
  
    const recipeFilesPromise = recipeFiles.map(recipeFile => Recipes_files.create(recipeFile));  
    await Promise.all(recipeFilesPromise);
}
  
async function init() {
    await createUsers(),
    await createChefs(),
    await createRecipes(),
    await createRecipeFile();
}
  
init();