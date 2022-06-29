const express = require("express");
const path = require("path");
const fs = require("fs");

module.exports = (app) => {
    fs
        .readdirSync(__dirname)
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
        .forEach(file => require(path.resolve(__dirname, file))(app));
}
