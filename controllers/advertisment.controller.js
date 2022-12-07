const advertismentService = require('../services/advertisment.service');
const upload = require('../middlewares/advertisment.upload');

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err)
        } else {
            if (req.body.type == "ad") {
                console.log(req.body);
                const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

                const dateTime = new Date().toLocaleString();

                var currentDate = dateTime.split(', ')[0];
                currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2]; 
                
                if(currentDate.split('/')[0].length == 1){
                    currentDate = "0" + currentDate;
                }

                var filteredDateTime = currentDate + " " + dateTime.split(', ')[1];

                var model = {
                    advertismentTitle: req.body.title,
                    advertismentDesc: req.body.description,
                    advertismentAttachment: path != "" ? "/" + path : "",
                    advertismentType: req.body.type,
                    createdDateTime: filteredDateTime,
                }

                advertismentService.createadvertisment(model, (error, results) => {
                    if (error) {
                        return next(error);
                    } else {
                        res.status(200).send({
                            message: "Success",
                            data: results,
                        });
                    }
                });
            } else {
                const dateTime = new Date().toLocaleString();

                var currentDate = dateTime.split(', ')[0];
                currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2]; 
                
                if(currentDate.split('/')[0].length == 1){
                    currentDate = "0" + currentDate;
                }
                
                var filteredDateTime = currentDate + " " + dateTime.split(', ')[1];

                var model = {
                    advertismentTitle: req.body.title,
                    advertismentDesc: req.body.description,
                    advertismentType: req.body.type,
                    createdDateTime: filteredDateTime,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    discount: req.body.discount,
                    categoryId: req.body.categoryId,
                }

                advertismentService.createadvertisment(model, (error, results) => {
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
        }
    });


}

exports.findAds = (req, res, next) => {

    advertismentService.getOnlyAds((error, results) => {
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

exports.findOffers = (req, res, next) => {

    advertismentService.getOnlyOffers((error, results) => {
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


exports.findActiveOffers = (req, res, next) => {

    advertismentService.getActiveOffers((error, results) => {
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