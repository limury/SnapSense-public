$(function() {
    // Enable or disable signup based on current authentication status.
    auth.onAuthStateChanged((user) => {
        if (user) {
            disableSignup();
        } else {
            activateSignup();
        }
    })

})

// add signup listener
function activateSignup() {
    $("#signup-btn").prop('disabled', false);
    $("#signup-form").on("submit", (e) => {
        // if passwords match
        e.preventDefault();
        if ($("#signup-password").val() === $("#signup-password-repeat").val()) {
            // create user and add display name
            auth.createUserWithEmailAndPassword($("#signup-email").val(), $("#signup-password").val())
                .then((cred) => {
                    auth.currentUser.updateProfile({
                            displayName: $("#signup-name").val()
                        })
                        .then(() => {
                            db.ref('patients/' + auth.currentUser.uid).set({
                                    name: $("#signup-name").val(),
                                    status: 1,
                                    email: $("#signup-email").val(),
                                })
                                .then((e) => {
                                    window.location.replace("/upload.html");
                                })
                        })
                        .catch((e) => {
                            $(makeAlert(e.message)).insertBefore($("#signup-btn"));
                        })
                })
                .catch((e) => {
                    $(makeAlert(e.message)).insertBefore($("#signup-btn"));
                })
        } else {
            $(makeAlert("Passwords do not match")).insertBefore($("#signup-btn"));
        }
    })
}

function disableSignup() {
    $("#signup-btn").prop('disabled', true);
    //$(loggedInAlert()).insertBefore($("#signup-btn"));
}