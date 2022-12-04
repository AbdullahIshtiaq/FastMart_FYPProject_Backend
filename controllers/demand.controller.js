const demandService = require('../services/demand.service');

exports.create = (req, res, next) => {
    console.log(req.body);  
    var model = {
        demandUserId: req.body.userId,
        message: req.body.message,
        demandStatus: req.body.status,    
    }

    if (req.body.product) {
        model.demandProduct = req.body.product;
    }

    demandService.createDemand(model, (error, results) => {
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
    console.log(req.query);

    var model = {
        status: req.query.status,
        demandUserId: req.query.userId,
        progress: req.query.progress,
    }

    demandService.getDemands(model, (error, results) => {
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

exports.update = (req, res, next) => {
    console.log(req.query);
    var model = {
        demandProgress: req.query.progress,
        demandId: req.query.demandId,
    }
    console.log("In Update");
    demandService.updateDemand(model, (error, results) => {
        if (error) {
            return next(error);
        } else {
            console.log(results);
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.delete = (req, res, next) => {
    console.log(req.params);

    var model = {
        demandId: req.params.id,
    }
    console.log("In Delete");

    demandService.deleteDemand(model, (error, results) => {

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
