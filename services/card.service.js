const user = require('../models/user.model');
const cards = require('../models/cards.model');
const dbConfig = require('../config/db.config');

const stripeService = require('../services/stripe.service');

async function createCard(params, callback) {
    console.log("In create order Line 8");
    console.log(params);
    user.findOne({ _id: params.userId }, async function (err, userDB) {
        if (err) {
            console.log("In create order Line 11");
            return callback(err);
        }
        else {
            console.log("In create order Line 15");
            console.log(userDB);
            var model = {};
            if (!userDB.stripeCustomerID) {
                console.log("In create order Line 18");
                await stripeService.createCustomer({
                    "name": userDB.username,
                    "email": userDB.email
                }, (err, result) => {
                    if (err) {
                        console.log("In create order Line 24");
                        return callback(err);
                    }
                    if (result) {
                        console.log("In create order Line 28");
                        userDB.stripeCustomerID = result.id;
                        userDB.save();

                        model.stripeCustomerID = result.id;
                    }
                }
                );
            } else {
                console.log("In create order Line 37");
                model.stripeCustomerID = userDB.stripeCustomerID;
            }

            console.log("In create order Line 41");
            cards.findOne({
                customerId: model.stripeCustomerID,
                cardNumber: params.card_Number,
            }, async function (err, cardDB) {
                if (err) {
                    console.log("In create order Line 49");
                    return callback(err);
                } else {
                    console.log("In create order Line 52");
                    if (!cardDB) {
                        console.log("In create order Line 54");
                        await stripeService.addCard({
                            "card_Name": params.card_Name,
                            "card_Number": params.card_Number,
                            "card_ExpMonth": params.card_ExpMonth,
                            "card_ExpYear": params.card_ExpYear,
                            "card_CVC": params.card_CVC,
                            "customer_Id": model.stripeCustomerID,
                        }, (err, result) => {
                            if (err) {
                                console.log("In create order Line 64");
                                console.log(err);
                                return callback(err);
                            }
                            if (result) {
                                console.log("In create order Line 69");
                                const cardModel = new cards({
                                    cardId: result.card,
                                    cardName: params.card_Name,
                                    cardNumber: params.card_Number,
                                    cardExpMonth: params.card_ExpMonth,
                                    cardExpYear: params.card_ExpYear,
                                    cardCVC: params.card_CVC,
                                    customerId: model.stripeCustomerID,

                                });
                                cardModel.save().then((response) => {
                                    console.log("In create order Line 81");
                                    return callback(null, response);

                                }).catch((error) => {
                                    console.log("In create order Line 85");
                                    return callback(error);
                                });
                            }
                        });
                    } else {
                        console.log("In create order Line 89");
                        return callback({
                            message: "card already exists"
                        }, "");
                    }
                }
            });
        }
    });
}

async function getUserCards(params, callback) {

    const userId = params;

    console.log(userId);

    user.findOne({ _id: userId }, async function (err, userDB) {
        if (err) {
            console.log("In create order Line 11");
            return callback(err);
        } else {
            console.log(userDB);
            if (userDB.stripeCustomerID) {
                cards.find({ customerId: userDB.stripeCustomerID }, "cardName cardNumber cardExpYear cardExpMonth cardCVC cardId")
                    .then((response) => {
                        console.log(response);
                        return callback(null, response);
                    }).catch((error) => {
                        console.log(error);
                        return callback(error);
                    });
            } else {
                return callback({
                    message: "No cards found"
                }, "");
            }
        }
    });
}

async function deleteCard(params, callback) {

    const cardId = params.cardId;

    cards.findOneAndDelete({cardId: cardId}, function (err, cardDB) {
        if (err) {
            console.log("In Error");
            return callback(err);
        } else {
            console.log(cardDB);
            if (cardDB) {
                return callback(null, cardDB);
            } else {
                return callback({
                    message: "No cards found"
                }, "");
            }
        }
    });   
}

module.exports = {
    getUserCards,
    createCard,
    deleteCard
};

