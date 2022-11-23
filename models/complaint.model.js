const mongoose = require('mongoose');
const schema = mongoose.Schema;

const  complaintSchema = new schema({
    complaintUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    complaintTitle: {
        type: String,
        required: true,
    },
    complaintMessage: {
        type: String,
        required: true,
    },
    createdDateTime: {
        type: Date,
        default: Date.now()
    },
});

complaintSchema.set("toJSON", {
    transform: (document, returnedOject) => {
        returnedOject.complaintId = returnedOject._id.toString();
        delete returnedOject._id;
        delete returnedOject.__v;
    }
});

const Complaint = mongoose.model("complaint", complaintSchema);

module.exports =  Complaint;