// const mongoose = require('mongoose');

// const order = mongoose.model(
//     'order',
//     new mongoose.Schema({
//         userId: {
//             type: String,
//             required: true,
//         },
//         products: [{
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'product',
//                 required: true,
//             },
//             amount: {
//                 type: Number,
//                 required: true,

//             },
//             qty: {
//                 type: Number,
//                 required: true,
//             },

//         }],
//         grandTotal: {
//             type: Number,
//             required: true,
//         },
//         orderStatus: {
//             type: String,
//             required: true,
//         },
//         transactionId: {
//             type: String,
//         },    
//     }, { timestamps: true })
// );

// module.exports = order;


const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const orderSchema = new schema({
    orderNo: {
        type: String,
        required: true,
        unique: true
    },
    orderUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    orderProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    paymentMethod: {
        type: String,
        required: true,
    },
    orderDate: {
        type: String,
        required: true
    },
    orderTime: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: false,
    },
    orderStatus: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
    }
});

orderSchema.set("toJSON", {
    transform: (document, returnedOject) => {
        returnedOject.orderId = returnedOject._id.toString();
        delete returnedOject._id;
        delete returnedOject.__v;
    }
});

orderSchema.plugin(uniqueValidator, { message: "Order number already in Exists." });

const order = mongoose.model("order", orderSchema);

module.exports = order;

