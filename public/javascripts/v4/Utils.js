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
    },

    createCookie : function createCookie(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/";
    },

    readCookie : function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' '){
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0){
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }
});
