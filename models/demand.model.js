const mongoose = require('mongoose');
const schema = mongoose.Schema;

const demandSchema = new schema({
    demandUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    demandProduct: {
        type: String,
        default: "None"
    },
    message: {
        type: String,
        required: true,
    },
    demandStatus: {
        type: String,
        required: true,
    },
    demandProgress: {
        type: String,
        default: "Pending"
    },
    createdDateTime: {
        type: Date,
        default: Date.now()
    },
});

demandSchema.set("toJSON", {
    transform: (document, returnedOject) => {
        returnedOject.demandId = returnedOject._id.toString();
        delete returnedOject._id;
        delete returnedOject.__v;
    }
});

const Demand = mongoose.model("demand", demandSchema);

module.exports = Demand;