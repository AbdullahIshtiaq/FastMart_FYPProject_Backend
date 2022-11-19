const salesService = require('../services/sales.service');

exports.findDaily = (req, res, next) => {
  
    salesService.getDailySales((error, results) => {
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

exports.findWeekly = (req, res, next) => {
  
    salesService.getWeeklySales((error, results) => {
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


exports.findMonthly = (req, res, next) => {
  
    salesService.getMonthlySales((error, results) => {
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