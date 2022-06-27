require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./controllers/authController")(app);
require("./controllers/projectController")(app);

app.get('/', (req, res) => {
    res.status(200)
});

app.listen(8081)