
// Client ID and API key from the Developer Console
var CLIENT_ID = '504766245284-7fbuta5fv818aeb879vvn03af7mkhuvq.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var authorizeButton;
var signoutButton;
$(document).ready(function() {
     $(".container").hide();
    authorizeButton = document.getElementById('authorize_button');
    signoutButton = document.getElementById('signout_button');
   
});

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);

}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    });

}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';  
        listData();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        $("#message").text("Please Authorize to see Training Calender");
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    $("#message").text("Please Authorize to see Training Calender");
    $(".loader").show();
    $(".container").hide();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    // var pre = document.getElementById('content');
    // var textContent = document.createTextNode(message + '\n');
    // pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1tWPmEdTJo0-i9_skMZdeM0NvGs_tdLbSLW6I8-SlDuU',
        range: 'Training!C2:E',
    }).then(function(response) {
        var range = response.result;
        console.log(range);
        if (range.values.length > 0) {
            // appendPre('Name, Major:');
            var len = range.values.length;
            var loop_start_val = len - 4;
            var iteration = 1;
            var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            for (i = loop_start_val; i < len; i++) {
                var row = range.values[i];
                var date = row[0];
                var date_arr = date.split("-");
                 // console.log('#date', iteration, date_arr[0] + '-' + date_arr[1]);
                $("#date" + iteration).text(date_arr[1] + '-' + date_arr[0]);
                $("#p" + iteration).text(row[1]);
                $("#span" + iteration).text(row[2]);
                var day_no = new Date(date).getDay();
                $('#day_name'+ iteration).text(weekday[day_no]);
                iteration++;
            }
            $(".loader").hide();
            $(".container").show();
        } else {
            alert('No data found. contact support');
        }
    }, function(response) {
        console.log('Error: ' , response.result.error.message);
    });
}
