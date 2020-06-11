const { hash } = require('bcryptjs');
const crypto = require('crypto')
const mailer = require('../../lib/mailer');

const User = require('../models/User');

module.exports = {
    async allusers(req, res) {
        try {
            const users = await User.findAll();
            return res.render("admin/users/index", { users });
        } catch (error) {
            console.error(error);
        }
    },
    registerForm(req, res) {
        return res.render("admin/users/register")
    },
    async show(req, res) {
        try {
            const { userId: id } = req.session

            const user = await User.findOne({ where: {id} });

            return res.render('admin/users/user', { user })

        }catch (error) {
            console.error(error);
            return res.render("admin/users/register", {
                error: "Usuário não encontrado."
            });
        }
    },
    async edit(req, res) {
        let { user } = req

        return res.render('admin/users/edit', { user })          
    },
    async post(req, res){
        let { name, email, is_admin = false } = req.body

        const password = crypto.randomBytes(5).toString('hex')
        const passwordHash = await hash(password, 8)

        await User.create({
            name,
            email,
            password: passwordHash,
            is_admin
        })

        try {

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Cadastro realizado',
                html: `<h2>Olá ${req.body.name}.</h2>
                <p>Seu acesso ao Foodfy foi criado com sucesso!</p>
                <p>Suas credenciais são:</p>
                <p>login: ${req.body.email}</p>
                <p>senha: ${password}</p>
                <p></br></br></p>
                <p>Para acessar sua conta, acesse clicando <a href="http://localhost:3000/sessions/login"><strong>aqui</strong></a></p> 
                
            `,
            })

            const users = await User.findAll()

            return res.render('admin/users/index', {
                users,
                success: "Usuário cadastrado com sucesso",
            })

        } catch (error) {
            console.error(error)
            return res.render('admin/users/register', {
                error: "Erro inesperado, tente novamente!"
            })
        }
  
    },
    async put(req, res) {
        try {
            let { user } = req
            let {name, email, password, is_admin} = req.body

            if (is_admin) {
                is_admin = true
            } else {
                is_admin = false
            }

            const passwordHash = await hash(password, 8)

            await User.update(user.id, {
                name,
                email,
                password: passwordHash,
                is_admin
            })

            user = {
                ...req.body,
                is_admin
            }

            const users = await User.findAll()
            
            if (req.session.is_admin == true) {
                return res.render("admin/users/index", {
                    users,
                    success: "Conta atualizada com sucesso!"
                })
            }else{
                return res.render("admin/users/user", {
                    user,
                    success: "Conta atualizada com sucesso!"
                })
            }

        }catch(err) {
            console.error(err)
            return res.render("admin/users/edit", {
                user: req.body,
                error: "Algum erro aconteceu!"
            })
        }
    },
    async delete(req, res) {
        try {
            const userId = req.body.id

            await User.delete(userId)

            const users = await User.findAll();

            return res.render("admin/users/index", {
                users,
                success: "Conta deletada com sucesso!"
            })

        }catch(err) {
            console.error(err)
            return res.render("admin/users/index", {
                user: req.body,
                error: "Erro ao tentar deletar sua conta!"
            })
        }
    }
}