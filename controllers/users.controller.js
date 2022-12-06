const bcryptjs = require('bcryptjs');
const userService = require('../services/users.services');
const upload = require('../middlewares/user.upload');

exports.register = (req, res, next) => {
    console.log("In User Controller Line 5");
    const { password } = req.body;
    const salt = bcryptjs.genSaltSync(10);
    req.body.password = bcryptjs.hashSync(password, salt);
    userService.register(req.body, (error, result) => {
        if (error) { return next(error); }
        console.log("In User Controller Line 12");
        console.log(result);
        return res.status(200).send({
            message: "Success",
            data: result
        });
    });
}

exports.login = (req, res, next) => {
    console.log("In User Controller Line 20");
    const { email, password } = req.body;
    console.log("In Controller " + email);
    userService.login({ email, password }, (error, result) => {
        if (error) { return next(error); }

        return res.status(200).send({
            message: "Success",
            data: result
        });
    });

}

exports.updateToken = (req, res, next) => {
    console.log("In User Controller Line 36 ");
    userService.updateToken(req.body, (error, results) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.updateProfile = (req, res, next) => {
    console.log("In User Controller Line 50 ");
    userService.updateProfile(req.body, (error, results) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.updateProfileImage = (req, res, next) => {
    console.log("In User Controller Line 65");
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            next(err)
        } else {
            console.log(req.file);
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                userImage: path != "" ? "/" + path : "",
            }
            userService.updateProfileImage(model, req.body.userId, (error, results) => {
                if (error) {
                    return next(error);
                } else {
                    res.status(200).send({
                        message: "Success",
                        data: results,
                    });
                }
            });
        }
    });
}

exports.getAll = (req, res, next) => {
    console.log("In User Controller Line 91");
    userService.getAll(req.query, (error, results) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}


exports.getUserById = (req, res, next) => {
    console.log("In User Controller Line 107");
    console.log(req.params);
    const userId = req.params.id;
    console.log(userId);
    userService.getUserById(userId, (error, results) => {
        if (error) {
            return next(error);
        } else {
            console.log("In User Controller Line 114");
            console.log(results);
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.changePassword = (req, res, next) => {
    console.log("In User Controller Line 123");
    userService.changePassword(req.body, (error, results) => {
        if (error) {
            return next(error);
        } else {
            if (results == "User Password Updated Successfully") {
                console.log("In User Controller Line 110");
                res.status(200).send({
                    message: "Success",
                    data: results,
                });
            }
            else {
                console.log("In User Controller Line 117");
                res.status(400).send({
                    message: "Failed",
                    data: results,
                });
            }
        }
    });
}

exports.userProfile = (req, res, next) => {
    return res.status(200).json({ message: "Authorized User!" })
}

