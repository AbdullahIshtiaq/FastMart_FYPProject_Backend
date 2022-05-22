const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = new schema({
    categoryName: {
        type: String,
        required: true,
        unique: true
    },
    categoryDesc: {
        type: String,
        required: true,

    },
    categoryImg: {
        type: String,
        required: true,
    },

});

// categorySchema.set("toJSON", {
//     transform: (document, returnedOject) => {
//         returnedOject.id = returnedOject._id.toString();
//         delete returnedOject._id;
//         delete returnedOject.__v;
//     }
// });

categorySchema.plugin(uniqueValidator, { message: "Category already in Exists." });

const Category = mongoose.model("category", categorySchema);

module.exports = Category;

