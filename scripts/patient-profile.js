var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};


function makeTimelineElem(date, url, message, status) {
    $("#timeline-list").prepend(`
				<li>
                    <p> ` + date + `</p>
                    <div class="card mb-3" style="max-width: 100%;">
                      <div class="row no-gutters">
                        <div class="col-md-4">
                          <img src="` + url + `" class="card-img" alt="...">
                        </div>
                        <div class="col-md-8">
                          <div class="card-body">
                            <h5 class="card-title">Status: ` + status + `</h5>
                            <p class="card-text"> ` + message + `</p>
                            <div class="btn-group" role="group" aria-label="Basic example">
                              <button type="button" class="btn btn-success">Discharge</button>
                              <button type="button" class="btn btn-warning">Dismiss till next week</button>
                              <button type="button" class="btn btn-danger">Schedule in person visit</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
				</li>
    `)
}

$(function() {

    auth.onAuthStateChanged(async(user) => {

        var uid = getUrlParameter('uid');

        if (user) {
            db.ref('patients/' + uid).on('value', async(s) => {
                // get about details from DB
                var name = "---";
                if ('name' in s.val()) { name = s.val().name; }
                var email = "---";
                if ('email' in s.val()) { email = s.val().email; }
                var status = 1;
                if ('status' in s.val()) { status = s.val().status }
                var podiatrist = "---";
                if ('podiatrist' in s.val()) { podiatrist = s.val().podiatrist };
                var doctor = "---";
                if ('doctor' in s.val()) { doctor = s.val().doctor; }

                $('#main-name').text(name);
                $('#profile-name').text(name);
                $('#profile-email').text(email);
                $('#profile-podiatrist').text(podiatrist);
                $('#profile-doctor').text(doctor);


                // place checkups in timeline
                if ('forms' in s.val()) {
                    await db.ref('patients/' + uid + '/forms').orderByChild('timestamp').on('value', async(sf) => {
                        for (var form in sf.val()) {
                            var date = new Date(sf.val()[form].timestamp),
                                message = sf.val()[form].main_message + sf.val()[form].message;
                            var imageURL = await storage.ref().child(sf.val()[form].pictures[0]).getDownloadURL();
                            var status = sf.val()[form].reason;

                            makeTimelineElem(date, imageURL, message, status);
                        }
                    })
                } else {}
            });
        }


    });

})