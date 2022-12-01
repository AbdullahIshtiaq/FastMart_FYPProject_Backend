const reportService = require('../services/report.service');

exports.findDaily = (req, res, next) => {
  
    reportService.getDailyReport((error, results) => {
        if (error) {
            return next(error);
        } else {
            //console.log(results);
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.findWeekly = (req, res, next) => {
  
    reportService.getWeeklyReport((error, results) => {
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
  
    reportService.getMonthlyReport((error, results) => {
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

exports.findCustomerReport = (req, res, next) => {
    const userId = req.query.userId;   
  
    reportService.getCustomerReport(userId, (error, results) => {
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