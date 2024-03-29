// Client ID from the Developer Console
var CLIENT_ID = '504766245284-81l0p7h10ckmht2f2r10evvjme2pnu4e.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var authorizeButton;
var signoutButton;
$(document).ready(function() {
    $(".cal-content").hide();
    authorizeButton = document.getElementById('authorize_button');
    signoutButton = document.getElementById('signout_button');

    $("#next").click(function() {
        if (current_end_row_no > total_rows) {
            alert('Reached end of page');
        } else {
            current_start_row_no = current_start_row_no + 4;
            render_schedule();
        }
    });

    $("#prev").click(function() {
        if (current_start_row_no <= 1) {
            alert('Reached starting of page');
        } else {
            current_start_row_no = current_start_row_no - 4;
            render_schedule();
        }
    });

    $("#cur_week_button").click(function() {
        current_start_row_no = current_week;
        render_schedule();
    });

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
    }).then(function() {
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
    $(".cal-content").hide();

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

// Example script
/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */

//***********************************************************************************//
// Training calender's data fetching and Display logic starts here                   //
//***********************************************************************************//

var current_start_row_no;
var current_end_row_no;
var current_week;
var total_rows;
var sheet_data;

function listData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1tWPmEdTJo0-i9_skMZdeM0NvGs_tdLbSLW6I8-SlDuU',
        range: 'Training!C2:E',
    }).then(function(response) {
        sheet_data = response.result;
        total_rows = sheet_data.values.length - 1;
        if (total_rows > 0) {
            var cur_date_obj = new Date();
            var cur_year = cur_date_obj.getFullYear();
            var cur_month = cur_date_obj.getMonth() + 1;
            var cur_day = cur_date_obj.getDate();
            if (cur_month < 10) {
                cur_month = "0" + cur_month;
            };
            if (cur_day < 10) {
                cur_day = "0" + cur_day;
            };

            var cur_date = cur_year + "" + cur_month + "" + cur_day;
            // appendPre('Name, Major:');
            var loop_start_val = total_rows - 4;
            var iteration = 1;

            for (i = loop_start_val; i > 0; i--) {
                var row = sheet_data.values[i];
                var date = row[0];
                var date_arr = date.split("-");

                var sch_date_obj = new Date(date);
                sch_date_obj.setFullYear(date_arr[2]);
                var sch_year = sch_date_obj.getFullYear();
                var sch_month = sch_date_obj.getMonth() + 1;
                var sch_day = sch_date_obj.getDate();
                if (sch_month < 10) {
                    sch_month = "0" + sch_month;
                };
                if (sch_day < 10) {
                    sch_day = "0" + sch_day;
                };


                var sch_date = sch_year + "" + sch_month + "" + sch_day;

                if (cur_date >= sch_date) {

                    if (cur_date > sch_date) {
                        current_start_row_no = i + 1;
                    } else {
                        current_start_row_no = i;
                    }
                    current_week = current_start_row_no;
                    render_schedule();
                    break;
                }
            }
            $(".loader").hide();
            $(".cal-content").show();

        } else {
            alert('No data found. contact support');
        }
    }, function(response) {
        console.log('Error: ', response.result.error.message);
    });
}

function render_schedule() {

    if (sheet_data.values.length <= 0) {
        return;
    }

    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var cur_row = current_start_row_no;
    var loop_end = cur_row + 4;
    for (i = 1; i <= 4; i++) {

        if (cur_row > total_rows) {
            $(".sc" + i).hide();
        } else {
            $(".sc" + i).show();
            var row = sheet_data.values[cur_row];
            var date = row[0];
            var date_arr = date.split("-");
            $("#date" + i).text(date_arr[1] + '-' + date_arr[0]);
            $("#p" + i).text(row[1]);
            $("#span" + i).text(row[2]);
            var sch_date_obj = new Date(date);
            sch_date_obj.setFullYear(date_arr[2]);
            var day_no = sch_date_obj.getDay();
            $('#day_name' + i).text(weekday[day_no]);
            cur_row++;
        }
    }
    current_end_row_no = cur_row;
}
