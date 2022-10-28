const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.model');

router.post("/adminlogin", async (req, res) => {
    console.log(req.body);
    if (req.body.password && req.body.email) {
        console.log(req.body.email);
        let admin = await Admin.findOne(req.body).select("-password");
        if (admin) {
            console.log(admin);
            res.send(admin);
        } else {
            res.send({ result: "No User Found" });
        }
    } else {
        res.send({ result: "No User Found" });
    }
});

router.post('/adminregister', async (req, res, next) => {
    console.log(req.body.email);
    console.log(req.body.password);
    const admin = new Admin(req.body);
    admin.save().then((response) => {
        console.log(response)
        return res.status(200).send({
            message: "Success",
            data: response
        });
    }).catch((error) => {
        console.log(error)
        return next(error);
    });
})

module.exports = router;