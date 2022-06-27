const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send({ err: "No token provided" });

    //Realizar separação do bearer e do token
    const parts = authHeader.split(' ');
    if (!parts.length == 2) return res.status(401).send({ err: "Token error" });

    // Separação SCHEME = Baerer e TOKEN = TOKEN DO BODY
    const [scheme, token] = parts;

    // Verificar se está escrito Baerer
    if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ err: "Token malformatted" });
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ err: "Token invalid" });

        req.userId = decoded.id;
        return next();
    });
};