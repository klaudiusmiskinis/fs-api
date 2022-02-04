require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.generarToken = generarToken(data) = () => {
    return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '18000s'});
};