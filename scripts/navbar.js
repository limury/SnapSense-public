$(function() {
    // add or remove the navbar buttons depending on authorisation status
    auth.onAuthStateChanged((user) => {
        if (user) {
            $("#home").show();
            $("#profile").show();
            $("#upload").show();
            $("#staff").hide();
            $("#login").hide();
            $("#signup").hide();
            $("#logout").show();
        } else {
            $("#home").show();
            $("#profile").hide();
            $("#upload").hide();
            $("#staff").show();
            $("#login").show();
            $("#signup").show();
            $("#logout").hide();
        }
    })

    $("#logout").click((e) => {
        auth.signOut().then((e) => {
            window.location.href("/login.html");
        });
    })

})


function loggedInAlert() {
    $('div[role="alert"]').remove();
    return `<div class="alert alert-danger" role="alert">
    You are already logged in. 
</div>`
}

function makeAlert(e) {
    $('div[role="alert"]').remove();
    return `<div class="alert alert-danger" role="alert">
    ${e}
</div>`
}