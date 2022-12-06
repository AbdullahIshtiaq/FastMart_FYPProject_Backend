const advertisment = require('../models/advertisment.model');

async function createadvertisment(params, callback) {

    console.log(params);

    if (!params.advertismentTitle) {
        return callback({
            message: "Title Required"
        }, "");
    }

    if (!params.advertismentDesc) {
        return callback({
            message: "Advertisment Description Required"
        }, "");
    }

    if (!params.advertismentType) {
        return callback({
            message: "Advertisment Type Required"
        }, "");
    }

    const model = advertisment(params);

    model.save().then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });
}

async function getOnlyAds(callback) {

    advertisment.find({ advertismentType: "ad" }, "advertismentTitle advertismentDesc advertismentType advertismentAttachment createdDateTime")
        .sort({ createdDateTime: -1 })
        .then((response) => {
            console.log(response);
            return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function getOnlyOffers(callback) {

    advertisment.find({ advertismentType: "offer" }, "advertismentTitle advertismentDesc advertismentType createdDateTime startDate endDate discount")
        .populate("categoryId", "categoryName categoryImg")
        .sort({ createdDateTime: -1 })
        .then((response) => {
            console.log(response);
            return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function getActiveOffers(callback) {

    advertisment.find({ advertismentType: "offer" }, "advertismentTitle advertismentDesc advertismentType createdDateTime startDate endDate discount")
        .populate("categoryId", "categoryName categoryImg")
        .sort({ createdDateTime: -1 })
        .then((response) => {
            console.log(response);
            filterOffers(response, (err, result) => {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, result);
                }
            });
            // return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function filterOffers(offerData, callback) {

    var currentDate = new Date().toLocaleString().split(', ')[0];
    currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2]; 
    
    const offerList = [];

    for (let i = 0; i < offerData.length; i++) {
        if (currentDate >= offerData[i].startDate && currentDate <= offerData[i].endDate) {
            offerList.push(offerData[i]);
        }
    }
    console.log(offerList);
    return callback(null, offerList);
}
module.exports = {
    createadvertisment,
    getOnlyAds,
    getOnlyOffers,
    getActiveOffers,
};