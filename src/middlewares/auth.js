const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.decode(token, 'secretkey');
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});
        console.log(user);
        console.log(token);
        if(!user)
            throw new Error();

        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        res.status(401).send('Please authorize.');
    }
}

module.exports = auth; 