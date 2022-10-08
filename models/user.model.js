const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    stripeCustomerID: {
        type: String,
    }


});

userSchema.set("toJSON", {
    transform: (document, returnedOject) => {
        returnedOject.id = returnedOject._id.toString();
        delete returnedOject._id;
        delete returnedOject.__v;
        delete returnedOject.password;
    }
})

userSchema.plugin(uniqueValidator, { message: "Email already in use." });

const User = mongoose.model("user", userSchema);

module.exports = User;

