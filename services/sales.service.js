const { parse } = require('dotenv');
const order = require('../models/order.model');

async function getDailySales(callback) {

    const dateTime = new Date().toLocaleString();
    const date = dateTime.split(', ')[0];
    console.log(date);

    order.find({ orderDate: date }, "orderNo total orderDate orderTime quantity")
        .then((response) => {
            console.log(response[0]);
            arrangeDaily(response, (err, result) => {
                console.log(result);
                return callback(null, result);
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
            slot1: [],
            slot2: [],
            slot3: [],
            slot4: [],
        }
    ];
    for (let i = 0; i < orderList.length; i++) {
        console.log(orderList[i].orderDate);
        const timeInSeconds = convertToSeconds(orderList[i].orderTime);
        console.log(timeInSeconds);
        if (timeInSeconds >= '39600' && timeInSeconds < '50400') {
            filteredOrderList[0].slot1.push(orderList[i]);
        } else if (timeInSeconds >= '50400' && timeInSeconds < '61200') {
            filteredOrderList[0].slot2.push(orderList[i]);
        } else if (timeInSeconds >= '61200' && timeInSeconds < '72000') {
            filteredOrderList[0].slot3.push(orderList[i]);
        } else if (timeInSeconds >= '72000' && timeInSeconds < '82800') {
            filteredOrderList[0].slot4.push(orderList[i]);
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
    const currentDate = dateTime.split(', ')[0];
    //const currentDate = "03/10/2022";

    const weeklyInitailDate = getWeekDate(currentDate);

    console.log(weeklyInitailDate);

    order.find({ orderDate: { $gte: weeklyInitailDate, $lte: currentDate } }, "orderNo total orderDate orderTime quantity")
        .then((response) => {
            //console.log(response);
            arrangeWeekly(weeklyInitailDate, response, (err, result) => {
                console.log(result);
                return callback(null, result);
            });
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

function getWeekDate(currentDate) {
    console.log("In create order Line 93");

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
    console.log(initialDate);
    const filteredOrderList = [
        {
            day1: [],
            day2: [],
            day3: [],
            day4: [],
            day5: [],
            day6: [],
            day7: [],
        }
    ];

    for (let i = 0; i < orderList.length; i++) {
        var date = orderList[i].orderDate.toString();
        //console.log(date);
        if (date == ((parseInt(initialDate.split('/')[0]) + 1) + "/" + initialDate.split('/')[1] + "/" + initialDate.split('/')[2])) {
            filteredOrderList[0].day1.push(orderList[i]);
        } else if (date == ((parseInt(initialDate.split('/')[0]) + 2) + "/" + initialDate.split('/')[1] + "/" + initialDate.split('/')[2])) {
            filteredOrderList[0].day2.push(orderList[i]);
        } else if (date == ((parseInt(initialDate.split('/')[0]) + 3) + "/" + initialDate.split('/')[1] + "/" + initialDate.split('/')[2])) {
            filteredOrderList[0].day3.push(orderList[i]);
        } else if (date == ((parseInt(initialDate.split('/')[0]) + 4) + "/" + initialDate.split('/')[1] + "/" + initialDate.split('/')[2])) {
            filteredOrderList[0].day4.push(orderList[i]);
        } else if (date == ((parseInt(initialDate.split('/')[0]) + 5) + "/" + initialDate.split('/')[1] + "/" + initialDate.split('/')[2])) {
            filteredOrderList[0].day5.push(orderList[i]);
        } else if (date == ((parseInt(initialDate.split('/')[0]) + 6) + "/" + initialDate.split('/')[1] + "/" + initialDate.split('/')[2])) {
            filteredOrderList[0].day6.push(orderList[i]);
        } else if (date == ((parseInt(initialDate.split('/')[0]) + 7) + "/" + initialDate.split('/')[1] + "/" + initialDate.split('/')[2])) {
            filteredOrderList[0].day7.push(orderList[i]);
        }
    }
    //console.log(filteredOrderList);
    return callback(null, filteredOrderList);
}

async function getMonthlySales(callback) {

    const dateTime = new Date().toLocaleString();
    const currentDate = dateTime.split(', ')[0];
    //const currentDate = "03/10/2022";

    const yearlyInitailDate = "01/01/" + currentDate.split('/')[2];

    order.find({ orderDate: { $gte: yearlyInitailDate, $lte: currentDate } }, "orderNo total orderDate orderTime quantity")
        .then((response) => {
            //console.log(response);
            arrangeMonthly(yearlyInitailDate, response, (err, result) => {
                console.log(result);
                return callback(null, result);
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
            month1: [],
            month2: [],
            month3: [],
            month4: [],
            month5: [],
            month6: [],
            month7: [],
            month8: [],
            month9: [],
            month10: [],
            month11: [],
            month12: [],

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
            filteredOrderList[0].month1.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-02-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-02-28T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month2.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-03-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-03-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month3.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-04-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-04-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month4.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-05-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-05-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month5.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-06-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-06-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month6.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-07-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-07-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month7.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-08-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(+year + "-08-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month8.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-09-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-09-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month9.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-10-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-10-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month10.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-11-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(+year + "-11-30T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month11.push(orderList[i]);
        } else if (seconds >= ((new Date(year + "-12-01T00:00:00").getTime()) / 1000) && seconds <= ((new Date(year + "-12-31T00:00:00").getTime()) / 1000)) {
            filteredOrderList[0].month12.push(orderList[i]);
        }
    }
    //console.log(filteredOrderList);
    return callback(null, filteredOrderList);
}

module.exports = {
    getDailySales,
    getWeeklySales,
    getMonthlySales
};