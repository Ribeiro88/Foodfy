const nodemailer = require('nodemailer')


module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2f9fd9c6e901cf",
      pass: "f12c4c95debc60"
    }
  });