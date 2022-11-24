const mongoose = require('mongoose');
const schema = mongoose.Schema;

const advertismentSchema = new schema({
    advertismentTitle: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    },
    advertismentDesc: {
        type: String,
        required: true
    },
    advertismentType: {
        type: String,
        required: true
    },
    createdDateTime: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        
    },
    endDate: {
        type: String,
        
    },
    discount: {
        type: Number,
    },   
    advertismentAttachment: {
        type: String,
    },
    
    

});

advertismentSchema.set("toJSON", {
    transform: (document, returnedOject) => {
        returnedOject.advertismentId = returnedOject._id.toString();
        delete returnedOject._id;
        delete returnedOject.__v;
    }
});

const Advertisment = mongoose.model("advertisment", advertismentSchema);

module.exports = Advertisment;