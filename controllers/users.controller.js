const bcryptjs = require('bcryptjs');
const userService = require('../services/users.services');

exports.register = (req, res, next) => {
    const { password } = req.body;
    const salt = bcryptjs.genSaltSync(10);

    req.body.password = bcryptjs.hashSync(password, salt);

    userService.register(req.body, (error, result) => {
        if (error) { return next(error); }

        return res.status(200).send({
            message: "Success",
            data: result
        });
    });
}

exports.login = (req, res, next) => {
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

exports.getAll = (req, res, next) => {
    console.log("In User Controller Line 50 ");
    userService.getAll( (error, results) => {
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

exports.userProfile = (req, res, next) => {

    return res.status(200).json({ message: "Authorized User!" })
}

