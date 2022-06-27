const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
    res.send({ OK: true });
});

module.exports = app => app.use('/projects', router);