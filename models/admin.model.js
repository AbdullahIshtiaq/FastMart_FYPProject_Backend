const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const adminSchema = new schema({
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    
});

adminSchema.set("toJSON", {
    transform: (document, returnedOject) => {
        returnedOject.id = returnedOject._id.toString();
        delete returnedOject._id;
        delete returnedOject.__v;
        delete returnedOject.password;
    }
})

adminSchema.plugin(uniqueValidator, { message: "Email already in use." });

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;