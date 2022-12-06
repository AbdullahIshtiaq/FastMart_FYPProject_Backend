const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const auth = require('../middlewares/auth');

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
    } else if (params.password === undefined) {
        return callback({
            message: "Password Required"
        })
    } else if (params.username === undefined) {
        return callback({
            message: "Username Required"
        })
    }
    const user = new User(params);

    user.save().then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });
}

async function updateToken(params, callback) {
    console.log("In User Service Line 47 ");
    console.log(params);
    var model = {
        fcmToken: params.fcmToken
    };

    User.findByIdAndUpdate(params.userId, model, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                return callback("User Token Update Failed");
            } else {
                return callback(null, "User Token Updated Successfully " + response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
}

async function updateProfile(body, callback) {
    console.log("In User Service Line 75 ");
    //console.log(body);
    var model = {
        username: body.username,
        phone: body.phone,
        city: body.city,
        phone: body.phone,
    };

    User.findByIdAndUpdate(body.userId, model, { useFindAndModify: true })
        .then((response) => {
            if (!response) {
                return callback("User Profile Update Failed");
            } else {
                console.log("In User Service Line 88 ");
                console.log(response);
                return callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
}

async function updateProfileImage(model, userId, callback) {
    console.log("In User Service Line 95 ");
    User.findOneAndUpdate({_id: userId}, {$set: model}, {new: true} )
        .then((response) => {
            if (!response) {
                return callback("User Profile Update Failed");
            } else {
                console.log("In User Service Line 111");
                console.log(response);
                return callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getAll(params, callback) {

    const username = params.username;
    var condition ={
        role: 'customer'
    };

    if (username != null) {
        condition['username'] = { $regex: new RegExp(username), $options: "i" };
    }

    User.find(condition, "username email userImage phone city date").then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });

}

async function getUserById(params, callback) {
    console.log("In User Service Line 135: "+params);
    User.findById(params).then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });

}

async function changePassword(params, callback) {
    console.log("In User Service Line 130");
    console.log(params);

    const user = await User.find({ _id: params.userId });

    if (user != null) {
        console.log("In User Service Line 136 ");
        console.log(params.oldPassword);
        console.log(user[0].password);
        if (bcryptjs.compareSync(params.oldPassword, user[0].password)) {

            const salt = bcryptjs.genSaltSync(10);
            params.newPassword = bcryptjs.hashSync(params.newPassword, salt);

            var model = {
                password: params.newPassword
            };

            User.findByIdAndUpdate(params.userId, model, { useFindAndModify: false })
            .then((response) => {
                if (!response) {
                    return callback("User Password Update Failed");
                } else {
                    return callback(null, "User Password Updated Successfully");
                }               
            }).catch((error) => {
                return callback(error);
            });
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

module.exports = {
    login,
    register,
    updateToken,
    getAll,
    updateProfile,
    updateProfileImage,
    changePassword,
    getUserById
}