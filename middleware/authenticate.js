const jwt = require("jsonwebtoken")
const User = require('../models/userSchema')
module.exports = Authenticate = async function(req, res, next) {

    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    console.log(token, "Auth Wala")
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
            if (err) {
                res.status(400).json({ message: 'Token invalid' });
            } else {

                req.decoded = decoded

                next();
                // res.status(200).json({ message: 'Succesfull token provided' });
            }
        });
    } else {
        res.status(400).json({message: 'No token provided' });
    }
};

//module.export = Authenticate