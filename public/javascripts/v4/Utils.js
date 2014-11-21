Module(CV, 'Utils')({
    months : {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'Octuber',
        '11': 'November',
        '12': 'December'
    },

    getMonthName : function getMonthName(month) {
        return this.months[month];
    },

    getMonthShortName : function getMonthShortName(month) {
        return this.months[month].substring(0,3);
    }

});
