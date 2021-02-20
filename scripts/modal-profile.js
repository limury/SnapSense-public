$(function() {

    user_data = {};

    // on opening timeline-modal
    $('#profile-modal').on('show.bs.modal', (e) => { modalGenerator(e, user_data) })

    $("#timeline-list").on("click", "#dropdown div a", function() { dropdownHandler(this, user_data) });

    $("#save-modal").on("click", () => { saveData(user_data) })

})

function saveData(user_data) {
    var $timeline = $("#timeline-list");
    var uid = $timeline.attr('uid');
    mock_db.set(`patients/${uid}/forms`, user_data.forms);
    mock_db.set(`patients/${uid}/status`, 0);
    fillTable("status");
}

function dropdownHandler(elem, data) {
    var clr = $(elem).attr("clr");
    var btn_ref = "#" + $(elem).attr("ref-id");
    var form_id = btn_ref.substring(5);
    $(btn_ref).text($(elem).text());
    $(btn_ref).attr("class", "btn dropdown-toggle " + clr)
    if ($(elem).text() == "Discharge") {
        data.forms[form_id].review = 0;
    } else if ($(elem).text() == "Review again next week") {
        data.forms[form_id].review = 1;
    } else if ($(elem).text() == "Request in person appointment") {
        data.forms[form_id].review = 2;
    }
}

function modalGenerator(e, data) {
    // extract patient uid for modal
    var uid = $(e.relatedTarget).attr('uid');
    // set patient name
    $("#profile-modal div div div h5").text(mock_db.get('patients/' + uid + '/name'));

    var tmp = mock_db.get(`patients/${uid}/forms`);
    // make deep copy
    var forms = JSON.parse(JSON.stringify(tmp));
    var form_keys = Object.keys(forms);
    var $timeline = $("#timeline-list");
    // clear current content
    $timeline.html("");
    $timeline.attr("uid", uid);
    data.forms = forms;

    var prediction = `SnapSense AI prediction: <span style='color: green'>2.45%</span> ischemia probability<br>
					<span style="font-size: 15px"> We suggest the check on the patient again in 1 week.</span> `;
    if ('prediction' in mock_db.get(`patients/${uid}`))
        prediction = mock_db.get(`patients/${uid}/prediction`);

    $("#prediction").html(prediction)

    // sort uploaded forms by date
    form_keys.sort((a, b) => { return forms[b].timestamp - forms[a].timestamp });

    var reviews = [
        ["No review selected", "btn-primary"],
        ["Discharge", "btn-success"],
        ["Review again next week", "btn-warning"],
        ["Request in person appointment", "btn-danger"]
    ];

    for (var key of form_keys) {
        var review = 0;
        if ("review" in forms[key]) {
            review = 1 + Number(forms[key].review);
        }
        var date = String(new Date(forms[key].timestamp));
        var url = "https://thumbs.dreamstime.com/b/pair-newborn-baby-foot-soles-bottom-view-tiny-plump-feet-cute-heel-toes-pair-newborn-baby-foot-soles-bottom-view-187868101.jpg";

        if ("url" in forms[key])
            url = forms[key].url;

        // generate the actual html
        var elem = makeTimelineElem(date.substring(0, 21), url, forms[key].main_message, forms[key].reason, reviews[review], key);
        // insert it into the timeline
        $timeline.prepend(elem);
    }
}


function makeTimelineElem(date, url, message, status, review, id) {
    return (`
		<li>
            <p>${date}</p>
            <div class="card mb-3" style="max-width: 100%;">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img src="${url}" class="card-img" alt="...">
                </div>
                <div class="col-md-8">
                  <div id="dropdown" class="card-body">
                    <h5 class="card-title">Reason for upload: ${status}</h5>
                    <p class="card-text">${message}</p>
                    <button id="btn-${id}" class="btn ${review[1]} dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ${review[0]}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item" clr="btn-success" ref-id="btn-${id}" href="#">Discharge</a>
                      <a class="dropdown-item" clr="btn-warning" ref-id="btn-${id}" href="#">Review again next week</a>
                      <a class="dropdown-item" clr="btn-danger"  ref-id="btn-${id}" href="#">Request in person appointment</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
		</li>
    `)
}