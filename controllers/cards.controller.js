const cardService = require('../services/card.service');


exports.create = (req, res, next) => {
    console.log(req.body);
    var model = {
        userId: req.body.userId,
        card_Number: req.body.card_Number,
        card_ExpMonth: req.body.card_ExpMonth,
        card_ExpYear: req.body.card_ExpYear,
        card_CVC: req.body.card_CVC,
        card_Name: req.body.card_Name
    }
    cardService.createCard(model, (error, results) => {
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

exports.findOfUser = (req, res, next) => {
    var cardUserID = req.query.cardUserID;

    console.log(cardUserID);

    if(cardUserID){
        cardService.getUserCards(cardUserID, (error, results) => {
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