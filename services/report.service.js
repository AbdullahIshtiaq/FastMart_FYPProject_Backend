const order = require('../models/order.model');
const category = require('../models/category.model');

async function getDailyReport(callback) {

    const dateTime = new Date().toLocaleString();
    var date = dateTime.split(', ')[0];
    date = date.split('/')[1] + "/" + date.split('/')[0] + "/" + date.split('/')[2];
    if(date.split('/')[0].length == 1){
        date = "0" + date;
    }
    console.log(date);

    order.find({ orderDate: date }, "total orderDate orderTime orderDiscount")
        .populate('orderProducts', 'productRetailPrice')
        .then((response) => {
            proccessData(response, (err, result) => {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, result);
                }
            });
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function getWeeklyReport(callback) {

    const dateTime = new Date().toLocaleString();
    var currentDate = dateTime.split(', ')[0];
    //var currentDate = "30/11/2022";
    currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2];

    if(currentDate.split('/')[0].length == 1){
        currentDate = "0" + currentDate;
    }

    var weeklyInitailDate = getWeekDate(currentDate);

    console.log(weeklyInitailDate);

    if (weeklyInitailDate.split('/')[1] == currentDate.split('/')[1]) {
        console.log("In if");
        order.find({ orderDate: { $gt: weeklyInitailDate, $lte: currentDate } }, "total orderDate orderTime orderDiscount")
            .populate('orderProducts', 'productRetailPrice')
            .then((response) => {
                console.log(response);
                proccessData(response, (err, result) => {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, result);
                    }
                });
            }).catch((error) => {
                console.log(error);
                return callback(error);
            });
    } else {
        console.log("In else");
        const secondDate = "01" + "/" + currentDate.split('/')[1] + "/" + currentDate.split('/')[2];
        order.find({ orderDate: { $gt: weeklyInitailDate } }, "total orderDate orderTime orderDiscount")
            .populate('orderProducts', 'productRetailPrice')
            .then((initialResponse) => {
                //console.log(initialResponse);
                order.find({ orderDate: { $gt: secondDate } }, "total orderDate orderTime orderDiscount")
                    .populate('orderProducts', 'productRetailPrice')
                    .then((secondResponse) => {
                        //console.log(secondResponse);
                        var array = [];
                        array = array.concat(initialResponse);
                        array = array.concat(secondResponse);
                        proccessData(array, (err, result) => {
                            if (err) {
                                return callback(err);
                            } else {
                                return callback(null, result);
                            }
                        });
                    }).catch((error) => {
                        console.log(error);
                        return callback(error);
                    });
            }).catch((error) => {
                console.log(error);
                return callback(error);
            });
    }
}

function getWeekDate(currentDate) {
    console.log("In Week Date Line 97");

    var month = currentDate.split('/')[1] - 1;
    var date = currentDate.split('/')[0];

    var weekDate = "";

    if (date <= 7) {
        //console.log("In Line Report 101");
        if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
            var dateNo = 20 + ((date - 7) + 11);
            weekDate = dateNo + "/" + month + "/" + currentDate.split('/')[2];
            //console.log("In Line Report 105");
        } else if (month == "04" || month == "06" || month == "09" || month == "11") {
            var dateNo = 20 + ((date - 7) + 10);
            weekDate = dateNo + "/" + month + "/" + currentDate.split('/')[2];
            // console.log("In Line Report 109");
        }
    } else {
        //console.log("In Line Report 98");
        weekDate = (date - 7) + "/" + (month + 1) + "/" + currentDate.split('/')[2];
    }
    //console.log(weekDate);
    return weekDate;
}

async function getMonthlyReport(callback) {

    const dateTime = new Date().toLocaleString();
    var currentDate = dateTime.split(', ')[0];
    currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2];

    if(currentDate.split('/')[0].length == 1){
        currentDate = "0" + currentDate;
    }

    const monthInitailDate = "01/" + currentDate.split('/')[1] + "/" + currentDate.split('/')[2];

    order.find({ orderDate: { $gte: monthInitailDate, $lte: currentDate } }, "total orderDate orderTime orderDiscount")
        .populate('orderProducts', 'productRetailPrice')
        .then((response) => {
            //console.log(response);
            proccessData(response, (err, result) => {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, result);
                }
            });
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function proccessData(orderList, callback) {
    console.log("In Process Report Line 104");
    //console.log(orderList);
    const Report = {
        totalSalePrice: 0,
        totalRetailPrice: 0,
        totalDiscount: 0,
        totalGrossProfit: 0,
        totalTaxCollected: 0,
        totalOperatingExpense: 0,
        totalNetProfit: 0
    };

    for (let i = 0; i < orderList.length; i++) {
        //console.log(orderList[i].orderProducts);
        Report.totalSalePrice += orderList[i].total;
        Report.totalDiscount += orderList[i].orderDiscount;
        for (let j = 0; j < orderList[i].orderProducts.length; j++) {
            Report.totalRetailPrice += orderList[i].orderProducts[j].productRetailPrice;
        }
    }
    Report.totalGrossProfit = (Report.totalSalePrice) - Report.totalRetailPrice;
    Report.totalTaxCollected = Report.totalSalePrice * 0.07;
    Report.totalOperatingExpense = Report.totalGrossProfit * 0.2;
    Report.totalNetProfit = (Report.totalGrossProfit - Report.totalOperatingExpense) - Report.totalTaxCollected;
    console.log(Report);
    return callback(null, Report);
}

async function getCustomerReport(userId, callback) {

    console.log(userId);

    order.find({ orderUser: userId }, "total orderDate orderTime orderDiscount")
        .populate('orderProducts', 'productRetailPrice')
        .then((response) => {
            proccessCustomerData(response, (err, result) => {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, result);
                }
            });
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function proccessCustomerData(orderList, callback) {
    console.log("In Process Report Line 153");
    //console.log(orderList);
    const customerReport = {
        totalOrder: 0,
        totalAmountSpent: 0,
        totalDiscountAvail: 0,
    };

    for (let i = 0; i < orderList.length; i++) {
        //console.log(orderList[i].orderProducts);
        customerReport.totalOrder++;
        customerReport.totalAmountSpent += orderList[i].total;
        customerReport.totalDiscountAvail += orderList[i].orderDiscount;
    }
    console.log(customerReport);
    return callback(null, customerReport);
}

module.exports = {
    getDailyReport,
    getWeeklyReport,
    getMonthlyReport,
    getCustomerReport
}
