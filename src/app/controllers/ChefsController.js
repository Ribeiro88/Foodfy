const { unlinkSync } = require('fs');

const Chefs = require("../models/Chefs");
const File = require("../models/File");

const LoadChefService = require("../services/LoadChefService");

module.exports = {
    async admin(req, res) {
        try {
            const chefs = await LoadChefService.load("chefs");
            return res.render("admin/chefs/index", { chefs });
        } catch (error) {
            console.error(error);
        }
    },
    
    create(req, res) {
        return res.render("admin/chefs/create");
    },
    
    async post(req, res) {
        try {

            const { filename, path } = req.file
            const { name } = req.body

            const fileId = await File.create({ name: filename, path })
    
            const chefId = await Chefs.create({ name, file_id: fileId })
    
  
            return res.redirect(`/admin/chefs/${chefId}`);

        } catch (error) {
            console.error(error);
        }
    },
    
    async show(req, res) {
        try {
            let chef = await LoadChefService.load("chef", req.params.id);
            if (!chef) return res.render("Chef não encontrado!");
    
            let image = await Chefs.files(chef.id);
            if (image[0]) image.src = image[0].path.replace("public", "");
    
            const recipes = await LoadChefService.load("recipes");
            return res.render("admin/chefs/show", { chef, image, recipes });

        } catch (error) {
            console.error(error);
        }
    },
    
    async edit(req, res) {
        try {
            let chef = await Chefs.find(req.params.id);
            if (!chef) return res.render("Chef não encontrado!");
    
            let files = await Chefs.files(chef.id);

            files = files.map((file) => ({
                ...file,
                src: files[0].path.replace("public", ""),
            }));
    
            return res.render("admin/chefs/edit", { chef, files });

        } catch (error) {
            console.error(error);
        }
    },
    
    async put(req, res) {
        try {
            let removedFiles = req.body.removed_files
    
            if (req.file) {
                if (removedFiles != '') {
                    removedFiles = req.body.removed_files.split(",")
                    const lastIndex = removedFiles.length - 1
                    removedFiles.splice(lastIndex, 1)
    
                } else {
                    const chef = await LoadChefService.load('chef', { where: {id: req.body.id} })
        
                    const oldAvatar = await Chefs.files({ where: {id: chef.file_id}})
                    removedFiles = [oldAvatar.id]
                }
    
                // add new avatar
                const { filename, path } = req.file
                const newAvatarId = await File.create({ name: filename, path })
                await Chefs.update(req.body.id, {name: req.body.name,file_id: newAvatarId})
    
                // remove old avatar
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
    
            } else {
                await Chefs.update(req.body.id, {
                    name: req.body.name     
                })
    
            }

            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch(error) {
            console.error(error)
        }
    },
    
    async delete(req, res) {
        try {
            const files = await Chefs.files(req.body.id);
            await Chefs.delete(req.body.id);

            files.map((file) => {
                try {
                    File.delete(file.file_id);
                    unlinkSync(file.path);
                } catch (error) {
                    console.error(error);
                }
            });

            req.session.success = "Chef deletado com sucesso!";
            return res.redirect("/admin/chefs");

        } catch (error) {
            console.error(error);
        }
    }
};