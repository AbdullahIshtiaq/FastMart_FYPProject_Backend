const Demand = require('../models/demand.model');

async function createDemand(params, callback) {

    if (!params.demandUserId) {
        return callback({
            message: "UserID Required"
        }, "");
    }

    if (!params.message) {
        return callback({
            message: "Message Required"
        }, "");
    }

    if (!params.demandStatus) {
        return callback({
            message: "Demand Status Required"
        }, "");
    }
    const model = Demand(params);

    model.save().then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });
}

async function getDemands(params, callback) {

    const demandStatus = params.status;
    const demandUserId = params.demandUserId;
    const demandProgress = params.progress;

    var condition = {};

    if (demandStatus) {
        condition["demandStatus"] = demandStatus;
    }

    if (demandUserId) {
        condition["demandUserId"] = demandUserId;
    }

    if (demandProgress) {
        condition["demandProgress"] = demandProgress;
    }

    console.log(condition);

    Demand.find(condition, "demandProduct message demandStatus demandProgress createdDateTime")
        .populate("demandUserId", "username")
        .sort({ createdDateTime: -1 })
        .then((response) => {
            //console.log(response);
            return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function updateDemand(params, callback) {

    const demandId = params.demandId;
    var model = {
        demandProgress: params.demandProgress,
    };

    console.log(params);

    Demand.findByIdAndUpdate(demandId, model, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                callback("Not Found Demand By ID: " + demandId);
            }
            else {
                callback(null, response);
            }
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function deleteDemand(params, callback) {

    const demandId = params.demandId;

    Demand.findByIdAndDelete(demandId)
        .then((response) => {
            if (!response) {
                callback("Not Found Demand By ID: " + demandId);
            }
            else {
                callback(null, response);
            }
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

module.exports = {
    createDemand,
    getDemands,
    updateDemand,
    deleteDemand
};