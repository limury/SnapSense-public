$(function() {

    // Enable or disable login based on current authentication status.
    auth.onAuthStateChanged((user) => {
        if (user) {
            disableLogin();
        } else {
            activateLogin();
        }
    })

})

// add login listener
function activateLogin() {
    $("#login-btn").prop('disabled', false);
    $("#login-form").on("submit", (e) => {
        auth.signInWithEmailAndPassword($("#login-email").val(), $("#login-password").val())
            .then((cred) => {
                window.location.replace("/upload.html");
            })
            .catch((e) => {
                $(otherAlert(e.message)).insertBefore($("#login-btn"));
            })
    })
    return false;
}

function disableLogin() {
    $("#login-btn").prop('disabled', true);
    $(loggedInAlert()).insertBefore($("#login-btn"));
}


function loggedInAlert() {
    $("#signup-btn").prop('disabled', true);
    return `<div class="alert alert-danger" role="alert">
    You are already logged in. 
</div>`
}

function otherAlert(e) {
    $("#signup-btn").prop('disabled', true);
    return `<div class="alert alert-danger" role="alert">
    ${e}
</div>`
}