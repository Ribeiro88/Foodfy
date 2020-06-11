async function checkAllFields(req) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
            return {
                chef: req.body,
                error: 'Todos os campos são obrigatórios!'
            }
        }
    }
}

async function post(req, res, next) {
    const fillAllFields = await checkAllFields(req)
    if (fillAllFields) {
        return res.render('admin/chefs/create', fillAllFields)
    }

    if (!req.file) return res.render('admin/chefs/create', {
        chef: req.body,
        error: 'Por favor, envie pelo menos uma imagem.'
    })

    next()
}

async function update(req, res, next) {
    try {
        let fillAllFields = await checkAllFields(req)

        if (fillAllFields) {
            fillAllFields = {
                ...fillAllFields
            }

            return res.render('admin/chef/edit', fillAllFields)
        }

        next()
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    post,
    update
}

/*module.exports = {
    post(req, res, next) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.render("admin/chefs/create", {
                    chef: req.body,
                    error: "Por favor, preencha todos os campos!"
                });
            }
        }

        if (!req.files) {
            return res.render("admin/chefs/create", {
                chef: req.body,
                error: "Por favor, envie pelo menos uma imagem."
            });
        }

        next();
    },

    update(req, res, next) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") { 
                return res.render("admin/chefs/edit", {
                    chef: req.body,
                    error: "Por favor, preencha todos os campos!"
                });
            }
        }

        next();
    }
}*/