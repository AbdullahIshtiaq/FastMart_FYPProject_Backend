const { STRIPE_CONFIG } = require('../config/db.config');
const stripe = require('stripe')(STRIPE_CONFIG.STRIPE_KEY);

async function createCustomer(params, callback) {
    try {
        const customer = await stripe.customers.create({
            name: params.name,
            email: params.email,
        });
        callback(null, customer);
    } catch (error) {
        return callback(error, null);
    }
}

async function addCard(params, callback) {
    try {
        console.log("In add card Line 18");
        console.log(params);
        const card_token = await stripe.tokens.create({
            card:{
            name: params.card_Name,
            number: params.card_Number,
            exp_month: params.card_ExpMonth,
            exp_year: params.card_ExpYear,
            cvc: params.card_CVC,}
        });

        console.log("In add card Line 27");
        console.log(card_token);
        const card = await stripe.customers.createSource(params.customer_Id, {
            source: card_token.id
        });

        console.log("In add card Line 32");
        callback(null, {card: card.id});
    } catch (error) {
        console.log("In add card Line 35");
        return callback(error, null);
    }
}

async function generatePaymentIntent(params, callback) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            receipt_email: params.receipt_email,
            amount: params.amount*100,
            currency: STRIPE_CONFIG.CURRENCY,
            payment_method: params.card_id,
            customer: params.customer_id,
            payment_method_types: ['card'],
        });
        callback(null, paymentIntent);
    } catch (error) {
        return callback(error, null);
    }
}

module.exports = {  
    createCustomer,
    addCard,
    generatePaymentIntent,
};