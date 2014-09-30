window.hansel = {};
 
// set api token
window.hansel.token = 'ZHJ2R3hzd3lDcjR5eFJhY3dxalFYQQ==:ZnJlc2hvdXQtYm90:VJ_6x1p3kedy7Hem4TdwTQ==';

// callback
// window.hansel.saveDataCallback = function(ev) {
//  // do magic with the event information
//  // and store whatever you want in an obj (var data = {})
//  // return data
// }

// callback
window.hansel.saveInitialDataCallback = function() {
    return {userID: window.currentUser}
};

window.gretel = {};

// callback
// window.gretel.appGetComponent = function(step) {
//  // return the dom node of the component related to the given step
// }

window.gretel.appSetInitialState = function(environment) {
    // the environment object holds all the data saved from the
    // app when the initial state was saved
    // resolution, browser, os, and also the initial state
    // saved using the window.hansel.saveInitialDataCallback fn if it was used
    // This function will return an object that will be evaluated by
    // a watir (http://watir.com/) to set the browser to the same initial state
    // as the user
    // return obj
};

// params needed to set the correct urls to get and post data
// to ginger (backend)
window.gretelParams = {};

gretelParams.gretelArray = window.document.referrer.replace(/https?:\/\//,'').split('/');
gretelParams.gretelOpen = gretelParams.gretelArray[1] == 'launch' ? true : false;

if (gretelParams.gretelOpen) {
    gretelParams.inicidenID = gretelParams.gretelArray[2];
    gretelParams.errorID = gretelParams.gretelArray[3];
    document.write(unescape("%3Cscript src='http://50.16.153.9/js/gretel.js' type='text/javascript'%3E%3C/script%3E"));
} else {
    document.write(unescape("%3Cscript src='http://50.16.153.9/js/hansel.js' type='text/javascript'%3E%3C/script%3E"));
}

window.gretel.init =function() {
    if (!window.gretelParams.gretelOpen) {
        var head = document.getElementsByTagName("head")[0];
        var newScript = document.createElement("script");
        newScript.type = 'text/javascript';
        newScript.src = 'http://50.16.153.9/js/gretel.js';
        head.appendChild(newScript);
    }
};