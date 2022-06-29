const express = require("express");
const User = require("../models/users");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

function generateCode(params = {}) {
    return jwt.sign(params, process.env.SECRET, {
        expiresIn: 86400,
    });
}
router.post("/register", async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: "E-mail de usuário já registrado !" })
        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({
            user,
            token: generateCode(
                { id: user.id }
            )
        });
    } catch (err) {
        return res.status(400).send({ error: "Registration failed" });
    }
});
router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) return res.status(400).send({ error: 'User not found ' });

    if (!await bcrypt.compare(password, user.password)) return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;


    res.send(
        {
            user,
            token: generateCode(
                { id: user.id }
            )
        }
    );
});
router.post("/forgot_password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(401).send({ error: "User not found" });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>Hello world? TOKEN: ${token} </b>`, // html body

        }, (err) => {
            if (err) return res.status(400).send({ error: 'Erro on forgot password, try again' })

            res.send();
        });

    } catch (err) {
        res.status(400).send({ error: "erro no forgot password, try again." })
    }
});
router.post("/reset_password", async (req, res) => {
    const { email, token, password } = req.body;
    try {
        const user = await User.findOne({ email })
            .select('+passwordResetExpires passwordResetToken');

        if (!user)
            return res.status(400).send({ error: "User not found" });

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: "Token invalid" });

        const now = new Date();

        if (now > user.passwordResetExpires)
            return res.status(401).send({ error: "Token expired, generate a new one" });

        user.password = password;
        await user.save();

        res.send({ tst:"OKAY" + password });

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Cannot reset password, try again!" });
    }
    const user = await User.findOne({ email })

});
module.exports = app => app.use('/auth', router);