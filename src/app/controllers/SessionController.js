const { hash } = require('bcryptjs')
const crypto = require('crypto');

const User = require('../models/User');

const mailer = require('../../lib/mailer');

module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id
        req.session.is_admin = req.user.is_admin

        return res.redirect("/admin/recipes")
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },
    forgotForm(req, res) {
        return res.render("session/forgot_password")
    },
    async forgot(req, res){
        const user = req.user

        try {

            // um token para esse usuário
            const token = crypto.randomBytes(20).toString("hex")

            // criar um expiração
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Esqueceu a senha?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/sessions/password_reset?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
            `,
            })

            // avisar o usuário que enviamos o email
            return res.render("session/forgot_password", {
                success: "Verifique seu email para resetar sua senha!"
            })
        } catch (err) {
            console.error(err)
            return res.render("session/forgot_password", {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    resetForm(req, res) {
        return res.render("session/password_reset", { token: req.query.token})
    },
    async reset(req, res) {
        const user = req.user

        const { password, token } = req.body
        
        try {
            // cria um novo hash de senha
            const newPassword = await hash(password, 8)

            // atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            // avisa o usuário que ele tem uma nova senha
            return res.render("session/login", {
                user:req.body,
                success: "Senha atualizada! Faça o seu login"
            })

        }catch(err) {
            console.error(err)
            return res.render("session/password_reset", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente!"
            })
        }

    }

}