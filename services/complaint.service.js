const complaint = require('../models/complaint.model');

async function createcomplaint(params, callback) {

    if (!params.complaintUserId) {
        return callback({
            message: "UserID Required"
        }, "");
    }

    if (!params.complaintTitle) {
        return callback({
            message: "Message Required"
        }, "");
    }

    if (!params.complaintMessage) {
        return callback({
            message: "Message Required"
        }, "");
    }

    const model = complaint(params);

    model.save().then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });
}

async function getcomplaints(params, callback) {

    const complaintUserId = params.userId;

    var condition = {};

    if (complaintUserId) {
        condition["complaintUserId"] = complaintUserId;
    }

    complaint.find(condition, "complaintTile complaintMessage createdDateTime")
        .populate("complaintUserId", "username")
        .sort({ createdDateTime: -1 })
        .then((response) => {
            console.log(response);
            return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}
module.exports = {
    createcomplaint,
    getcomplaints,
};