const cardService = require('../services/card.service');

exports.findOfUser = (req, res, next) => {
    var cardUserID = req.query.cardUserID;

    if(cardUserID){
        orderService.getUserOrders(cardUserID, (error, results) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).send({
                    message: "Success",
                    data: results,
                });
            }
        });
    }else{
        res.status(404).send({
            message: "User ID not found",
            data: null,
        });

    }
}