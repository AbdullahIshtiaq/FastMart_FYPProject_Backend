const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = new schema({
    productBarcode: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    productShortDesc: {
        type: String,
        required: true,
    },
    productDesc: {
        type: String,
        required: false,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productSalePrice: {
        type: Number,
        required: true,
        default: 0
    },
    productImg: {
        type: String,
        required: true,
    },
    stockStatus: {
        type: String,
        default: "IN"
    },
});

productSchema.set("toJSON", {
    transform: (document, returnedOject) => {
        console.log("In transform "+returnedOject._id)
        returnedOject.productId = returnedOject._id.toString();
        //delete returnedOject._id;
        //delete returnedOject.__v;
    }
});

productSchema.plugin(uniqueValidator, { message: "Product already in Exists." });

const Product = mongoose.model("product", productSchema);

module.exports = Product;

