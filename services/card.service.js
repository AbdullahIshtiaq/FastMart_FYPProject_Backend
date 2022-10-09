const user = require('../models/user.model');
const cards = require('../models/cards.model');
const dbConfig = require('../config/db.config');

const stripeService = require('../services/stripe.service');

async function getUserCards(params, callback) {

    const userId = params;

    user.findOne({ _id: userId }, async function (err, userDB) {
        if (err) {
            console.log("In create order Line 11");
            return callback(err);
        } else {
            if (userDB.stripeCustomerId) {
                cards.find({ customerId:userDB.stripeCustomerId }, "cardName cardNumber cardExpYear cardExpMonth cardCVC cardId")
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

module.exports = {
    getUserCards,
};

