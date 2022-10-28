const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const auth = require('../middlewares/auth');
const Admin = require('../models/admin.model');

async function login({ email, password }, callback) {
    console.log("In User Service " + email);

    const user = await User.findOne({ email });

    console.log("In User Service 10 " + email);

    if (user != null) {
        if (bcryptjs.compareSync(password, user.password)) {
            const token = auth.generateAccessToken(email);
            return callback(null, { ...user.toJSON(), token });
        } else {
            return callback({
                message: "Invalid Email/Password!"
            })
        }

    } else {
        return callback({
            message: "Invalid Email/Password!"
        })
    }
}

async function register(params, callback) {

    if (params.email === undefined) {
        return callback({
            message: "Email Required"
        })
    }
    const user = new User(params);

    user.save().then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });
}

module.exports = {
    login,
    register
}