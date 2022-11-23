const complaintService = require('../services/complaint.service');

exports.create = (req, res, next) => {
    console.log(req.body);  
    var model = {
        complaintUserId: req.body.userId,
        complaintMessage: req.body.message,
        complaintTitle: req.body.title,    
    }

    complaintService.createcomplaint(model, (error, results) => {
        if (error) {
            console.log("In error")
            //console.log(error);
            return next(error);
        } else {
            console.log("In else")
            console.log(results)
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.find = (req, res, next) => {

    var model = {
        complaintUserId: req.query.userId,
    }

    complaintService.getcomplaints(model, (error, results) => {
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
