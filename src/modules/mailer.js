const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require('path');

var transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});

transport.use('compile', hbs({
    viewPath: path.resolve('./src/resources/mail/'),
    viewEngine: 'handlebars',
    extName: '.html'
}));

module.exports = transport;