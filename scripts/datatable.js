$(function() {
    // initialize items for possible sorting
    users = null;

    // initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Enable or disable signup based on current authentication status.
    auth.onAuthStateChanged((user) => {
        if (user) {
            fillTable("status");
        } else {
            makeAlert("You are not logged in");
        }
    })

})

var data = null;

function fillTable(order) {
    // reference the table element
    $tbody = $("#tbody");
    $tbody.html("");
    // get the list of patients
    if (!data) {
        users = mock_db.get('patients');
        data = users;
    }
    statuses = ["green", "orange", "red"];

    uids = Object.keys(users);
    uids.sort((a, b) => {
        return users[b]['status'] - users[a]['status']
    })

    // for each patient
    for (const uid of uids) {
        // get patient status
        status = statuses[parseInt(users[uid]["status"])];
        // get patient name
        full_name = users[uid]["name"];
        // get when they last updated their record
        last_updated = "-";
        if ("forms" in users[uid]) {
            var dates = Object.keys(users[uid]["forms"]).map((k) => [users[uid]["forms"][k]["timestamp"]]);
            last_updated = Math.max(dates);
        }


        // insert all the data into the table
        $tbody.append(makePatientTr(uid, status, full_name, new Date(last_updated).toString().slice(0, 21), new Date(last_updated).toString().slice(0, 21)))
    }

    // initialise the tooltip above the buttons for all of them
    $('[data-toggle="tooltip"]').tooltip();
}



function makeSortUp() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-up" viewBox="0 0 16 16">
        <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>        
    </svg>`;
}

function makeSortDown() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-down" viewBox="0 0 16 16">
        <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>        
    </svg>`;
}

function makePatientTr(uid, status, name, last_updated, last_review) {
    if (last_updated === "Invalid Date") {
        last_updated = "Yesterday";
    }
    if (last_review === "Invalid Date") {
        last_review = "Yesterday";
    }
    return `
    <tr id="${uid}">
        <td class="text-nowrap align-middle">
            <div class="d-flex justify-content-center">
                <svg mlns="http://www.w3.org/2000/svg" width="28" height="28" fill="${status}" class="bi bi-flag-fill" viewBox="0 0 16 16"><path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/> </svg>
            </div>
        </td>
        <td class="text-nowrap align-middle">${name}</td>
        <td class="text-nowrap align-middle">${last_updated}</td>
        <td class="text-nowrap align-middle">${last_review}</td>
        <td class="text-nowrap align-middle">
            <div class="d-flex justify-content-around">
                <button uid="${uid}" fn="email" type="button" class="btn btn-primary btn-circle btn-xl" data-toggle="tooltip" data-placement="top" title="Send picture request"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/> </svg> </button>
                <span data-toggle="modal" data-target="#profile-modal" uid="${uid}"><button uid="${uid}" fn="history" type="button" class="btn btn-primary btn-circle btn-xl" data-toggle="tooltip" data-placement="top" title="View record"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-file-medical" viewBox="0 0 16 16"> <path d="M8.5 4.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L7 6l-.549.317a.5.5 0 1 0 .5.866l.549-.317V7.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L9 6l.549-.317a.5.5 0 1 0-.5-.866l-.549.317V4.5zM5.5 9a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/> <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/> </svg> </button></span>
                <button uid="${uid}" fn="profile" type="button" class="btn btn-primary btn-circle btn-xl" data-toggle="tooltip" data-placement="top" title="View profile"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16"> <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/> </svg> </button>
            </div>
        </td>
    </tr>`
}