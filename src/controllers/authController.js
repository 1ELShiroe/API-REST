const express = require("express");
const User = require("../database/models/users");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


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

module.exports = app => app.use('/auth', router);