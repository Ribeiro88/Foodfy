const User = require('../models/User')


function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function post(req, res, next) {

    //check if has all fields
    const fillAllFields = checkAllFields(req.body)

    try {
        if(fillAllFields){
            return res.render("admin/users/register", fillAllFields)
        }

        //check if user exists [email, name]
        let { name, email} = req.body

    
        const user = await User.findOne({ 
            where: { name },
            or: { email }
        })

        if (user) return res.render('admin/users/register', {
            user: req.body,
            error: 'Usuário já cadastrado.'
        })

        next()

    } catch (error) {
        console.error(error);
    }
}


async function show(req, res, next) {
    const { userId: id } = req.session

    try {

        const user = await User.findOne({ where: {id} })

        if (!user) return res.render("admin/users/index", {
            error: "Usuário não encontrado!"
        })

        req.user = user

        next()

    } catch (error) {
        console.error(error);
    }
}

async function edit(req, res, next) {
    const { id } = req.params

    const user = await User.findOne({
        where: { id }
    })

    if (!user) {
        const users = await User.findAll()

        return res.render('admin/users/index', {
            users,
            error: "Usuário não encontrado!"
        })
    }

    req.user = user

    next()
}

async function update(req, res, next) {

    //check if has all fields
    const fillAllFields = checkAllFields(req.body)

    try {

        if(fillAllFields){
            return res.render("admin/users/edit", fillAllFields)
        }

        const { id } = req.body

        const user = await User.findOne({ where: {id} })

        req.user = user

        next()

    } catch (error) {
        console.error(error);
    }

}

module.exports = {
    post,
    show,
    edit,
    update
}