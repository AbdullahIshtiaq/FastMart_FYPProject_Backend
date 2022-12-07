const order = require('../models/order.model');
const category = require('../models/category.model');

async function getDailySales(callback) {

    const dateTime = new Date().toLocaleString();
    
    var  date = dateTime.split(', ')[0];
    date = date.split('/')[1] + "/" + date.split('/')[0] + "/" + date.split('/')[2];
    if(date.split('/')[0].length == 1){
        date = "0" + date;
    }
    console.log(date);

    order.find({ orderDate: date }, "orderNo total orderDate orderTime quantity")
        .then((response) => {
            console.log(response[0]);
            arrangeDaily(response, (err, result) => {
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

async function arrangeDaily(orderList, callback) {
    console.log("In create order Line 24");
    const filteredOrderList = [
        {
            slot1: {
                total: 0,
                quantity: 0
            },
            slot2: {
                total: 0,
                quantity: 0
            },
            slot3: {
                total: 0,
                quantity: 0
            },
            slot4: {
                total: 0,
                quantity: 0
            },
        }
    ];
    for (let i = 0; i < orderList.length; i++) {
        console.log(orderList[i].orderDate);
        const timeInSeconds = convertToSeconds(orderList[i].orderTime);
        console.log(timeInSeconds);
        if (timeInSeconds >= '39600' && timeInSeconds < '50400') {
            filteredOrderList[0].slot1.total += orderList[i].total;
            filteredOrderList[0].slot1.quantity += orderList[i].quantity;
        } else if (timeInSeconds >= '50400' && timeInSeconds < '61200') {
            filteredOrderList[0].slot2.total += orderList[i].total;
            filteredOrderList[0].slot2.quantity += orderList[i].quantity;
        } else if (timeInSeconds >= '61200' && timeInSeconds < '72000') {
            filteredOrderList[0].slot3.total += orderList[i].total;
            filteredOrderList[0].slot3.quantity += orderList[i].quantity;
        } else if (timeInSeconds >= '72000' && timeInSeconds < '82800') {
            filteredOrderList[0].slot4.total += orderList[i].total;
            filteredOrderList[0].slot4.quantity += orderList[i].quantity;
        }
    }
    console.log(filteredOrderList);
    return callback(null, filteredOrderList);
}

function convertToSeconds(time) {
    console.log("In create order Line 62");

    var a = time.split(':');

    console.log(a);

    var seconds = 0;
    if (a[2].split(' ')[1] == "pm") {
        a[0] = +a[0] + 12;
        seconds = (a[0]) * 60 * 60 + (a[1]) * 60 + (a[2].split(' ')[0]);
    } else {
        seconds = (a[0]) * 60 * 60 + (a[1]) * 60 + (a[2].split(' ')[0]);
    }
    console.log(seconds);
    return seconds;
}

async function getWeeklySales(callback) {

    const dateTime = new Date().toLocaleString();
    console.log("In Sales Weekly Current DateTime: " + dateTime);

    var currentDate = dateTime.split(', ')[0];

    currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2];

    if(date.split('/')[0].length == 1){
        date = "0" + date;
    }

    console.log("In Sales Weekly Current Date: " + currentDate);
    //const currentDate = "03/10/2022";

    const weeklyInitailDate = getWeekDate(currentDate);
    //const weeklyInitailDate = "28/11/2022";

    console.log("In Sales Weekly Week Date: " + weeklyInitailDate);

    if (weeklyInitailDate.split('/')[1] == currentDate.split('/')[1]) {
        console.log("In if");
        order.find({ orderDate: { $gt: weeklyInitailDate, $lte: currentDate } }, "orderNo total orderDate orderTime quantity")
            .then((response) => {
                console.log(response);
                arrangeWeekly(weeklyInitailDate, response, (err, result) => {
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
        order.find({ orderDate: { $gt: weeklyInitailDate } }, "orderNo total orderDate orderTime quantity")
            .then((initialResponse) => {
                //console.log(initialResponse);
                order.find({ orderDate: { $gt: secondDate } }, "orderNo total orderDate orderTime quantity")
                    .then((secondResponse) => {
                        //console.log(secondResponse);
                        var array = [];
                        array = array.concat(initialResponse);
                        array = array.concat(secondResponse);
                        arrangeWeekly(weeklyInitailDate, array, (err, result) => {
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
    console.log("In get week data Line 147");

    var month = currentDate.split('/')[1] - 1;
    var date = currentDate.split('/')[0];

    var weekDate = "";

    if (date <= 7) {
        console.log("In Line 101");
        if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
            var dateNo = 20 + ((date - 7) + 11);
            weekDate = dateNo + "/" + month + "/" + currentDate.split('/')[2];
            console.log("In Line 105");
        } else if (month == "04" || month == "06" || month == "09" || month == "11") {
            var dateNo = 20 + ((date - 7) + 10);
            weekDate = dateNo + "/" + month + "/" + currentDate.split('/')[2];
            console.log("In Line 109");
        }
    } else {
        console.log("In Line 112");
        weekDate = (date - 7) + "/" + (month + 1) + "/" + currentDate.split('/')[2];
    }

    //console.log(weekDate);
    return weekDate;
}

async function arrangeWeekly(initialDate, orderList, callback) {
    console.log("In Line 122");
    //console.log(initialDate);
    console.log(orderList);
    const filteredOrderList = [
        {
            day1: {
                total: 0,
                quantity: 0
            },
            day2: {
                total: 0,
                quantity: 0
            },
            day3: {
                total: 0,
                quantity: 0
            },
            day4: {
                total: 0,
                quantity: 0
            },
            day5: {
                total: 0,
                quantity: 0
            },
            day6: {
                total: 0,
                quantity: 0
            },
            day7: {
                total: 0,
                quantity: 0
            },
        }
    ];
    const dateArray = initialDate.split('/');
    const initialTime = ((new Date(dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0] + "T00:00:00").getTime()) / 1000);
    //console.log('initialTime: ' + initialTime);

    for (let i = 0; i < orderList.length; i++) {
        var vals = orderList[i].orderDate.toString().split('/');
        var date = new Date(vals[2] + "-" + vals[1] + "-" + vals[0] + "T00:00:00");
        var currentSeconds = date.getTime() / 1000;
        //console.log(date);
        //console.log(currentSeconds);

        if (initialTime < currentSeconds && currentSeconds <= (initialTime + 86400)) {
            filteredOrderList[0].day1.total += orderList[i].total;
            filteredOrderList[0].day1.quantity += orderList[i].quantity;
        } else if ((initialTime + 86400) < currentSeconds && currentSeconds <= (initialTime + (86400 * 2))) {
            filteredOrderList[0].day2.total += orderList[i].total;
            filteredOrderList[0].day2.quantity += orderList[i].quantity;
        } else if ((initialTime + (86400 * 2)) < currentSeconds && currentSeconds <= (initialTime + (86400 * 3))) {
            filteredOrderList[0].day3.total += orderList[i].total;
            filteredOrderList[0].day3.quantity += orderList[i].quantity;
        } else if ((initialTime + (86400 * 3)) < currentSeconds && currentSeconds <= (initialTime + (86400 * 4))) {
            filteredOrderList[0].day4.total += orderList[i].total;
            filteredOrderList[0].day4.quantity += orderList[i].quantity;
        } else if ((initialTime + (86400 * 4)) < currentSeconds && currentSeconds <= (initialTime + (86400 * 5))) {
            filteredOrderList[0].day5.total += orderList[i].total;
            filteredOrderList[0].day5.quantity += orderList[i].quantity;
        } else if ((initialTime + (86400 * 5)) < currentSeconds && currentSeconds <= (initialTime + (86400 * 6))) {
            filteredOrderList[0].day6.total += orderList[i].total;
            filteredOrderList[0].day6.quantity += orderList[i].quantity;
        } else if ((initialTime + (86400 * 6)) < currentSeconds && currentSeconds <= (initialTime + (86400 * 7))) {
            filteredOrderList[0].day7.total += orderList[i].total;
            filteredOrderList[0].day7.quantity += orderList[i].quantity;
        }

    }
    //console.log(filteredOrderList);
    return callback(null, filteredOrderList);
}

async function getMonthlySales(callback) {

    const dateTime = new Date().toLocaleString();
    var currentDate = dateTime.split(', ')[0];
    currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2];
    if(date.split('/')[0].length == 1){
        date = "0" + date;
    }
    //const currentDate = "03/10/2022";
    const yearlyInitailDate = "01/01/" + currentDate.split('/')[2];

    order.find({ orderDate: { $gte: yearlyInitailDate, $lte: currentDate } }, "orderNo total orderDate orderTime quantity")
        .then((response) => {
            //console.log(response);
            arrangeMonthly(yearlyInitailDate, response, (err, result) => {
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

async function arrangeMonthly(initialDate, orderList, callback) {
    console.log("In Line 180");
    console.log(initialDate);
    const year = initialDate.split('/')[2];
    const filteredOrderList = [
        {
            month1: {
                total: 0,
                quantity: 0
            },
            month2: {
                total: 0,
                quantity: 0
            },
            month3: {
                total: 0,
                quantity: 0
            },
            month4: {
                total: 0,
                quantity: 0
            },
            month5: {
                total: 0,
                quantity: 0
            },
            month6: {
                total: 0,
                quantity: 0
            },
            month7: {
                total: 0,
                quantity: 0
            },
            month8: {
                total: 0,
                quantity: 0
            },
            month9: {
                total: 0,
                quantity: 0
            },
            month10: {
                total: 0,
                quantity: 0
            },
            month11: {
                total: 0,
                quantity: 0
            },
            month12: {
                total: 0,
                quantity: 0
            },

        }
    ];

    var time = ((new Date(year + "-01-01T00:00:00").getTime()) / 1000);
    console.log(time);
    setTimeout

    for (let i = 0; i < orderList.length; i++) {
        var vals = orderList[i].orderDate.toString().split('/');
        var date = new Date(vals[2] + "-" + vals[1] + "-" + vals[0] + "T00:00:00");
        // console.log(date);
        var seconds = date.getTime() / 1000;
        //console.log(seconds);

        if (seconds >= ((new Date(year + "-01-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-01-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month1.total += orderList[i].total;
            filteredOrderList[0].month1.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-02-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-02-28T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month2.total += orderList[i].total;
            filteredOrderList[0].month2.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-03-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-03-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month3.total += orderList[i].total;
            filteredOrderList[0].month3.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-04-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-04-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month4.total += orderList[i].total;
            filteredOrderList[0].month4.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-05-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-05-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month5.total += orderList[i].total;
            filteredOrderList[0].month5.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-06-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-06-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month6.total += orderList[i].total;
            filteredOrderList[0].month6.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-07-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-07-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month7.total += orderList[i].total;
            filteredOrderList[0].month7.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-08-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(+year + "-08-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month8.total += orderList[i].total;
            filteredOrderList[0].month8.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-09-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-09-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month9.total += orderList[i].total;
            filteredOrderList[0].month9.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-10-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-10-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month10.total += orderList[i].total;
            filteredOrderList[0].month10.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-11-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(+year + "-11-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month11.total += orderList[i].total;
            filteredOrderList[0].month11.quantity += orderList[i].quantity;
        } else if (seconds >= ((new Date(year + "-12-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-12-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month12.total += orderList[i].total;
            filteredOrderList[0].month12.quantity += orderList[i].quantity;
        }
    }
    //console.log(filteredOrderList);
    return callback(null, filteredOrderList);
}

async function getCategorySales(callback) {

    order.find({}, "orderNo")
        .populate({
            path: 'orderProducts',
            model: 'product',
            select: 'productPrice',
            populate: {
                path: 'category',
                model: 'category',
                select: 'categoryName'
            }
        }).then((response) => {
            //console.log(response);
            arrangeCategory(response, (err, result) => {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, result);
                }
            });
            //return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function makeCategoryList(callback) {
    const categoryList = [];

    category.find({}, "categoryName").then((response) => {
        for (let i = 0; i < response.length; i++) {
            categoryList.push({
                categoryName: response[i].categoryName,
                total: 0,
                quantity: 0
            });
        }
        //console.log(categoryList);
        return callback(null, categoryList);
    }).catch((error) => {
        console.log(error);
        return callback(error);
    });
}

async function arrangeCategory(categoryData, callback) {

    makeCategoryList((err, categoryList) => {
        if (err) {
            console.log(err);
            return callback(err);
        } else {

            for (let i = 0; i < categoryData.length; i++) {
                for (let j = 0; j < categoryData[i].orderProducts.length; j++) {
                    for (let k = 0; k < categoryList.length; k++) {
                        if (categoryData[i].orderProducts[j].category.categoryName == categoryList[k].categoryName) {
                            categoryList[k].total += categoryData[i].orderProducts[j].productPrice;
                            categoryList[k].quantity += 1;
                        }
                    }
                }
            }
            //console.log(categoryList);
            return callback(null, categoryList);
        }

    });
}

module.exports = {
    getDailySales,
    getWeeklySales,
    getMonthlySales,
    getCategorySales
};