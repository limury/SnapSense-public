function next_step(elem, step_num) {
    // get question being currently displayed
    var $current_step = $(elem).parent().parent();
    // get next question to display
    var $next_step = $(elem).parent().parent().next();

    // remove the current question
    $current_step.removeClass("show");
    // show the next question
    $next_step.addClass("show");
    // change the progress on the progress bar
    $("#progressbar li").eq(Number(step_num)).addClass("active");

    // animate the current step being removed and the next appearing
    $current_step.animate({}, {
        step: function() {
            $current_step.css({
                'display': 'none',
                'position': 'relative'
            });
            $current_step.css({
                'display': 'block'
            });
        }
    });
}

function prev_step(elem, step_num) {
    // get question being currently displayed
    var $current_step = $(elem).parent().parent();
    // get next question to display
    var $next_step = $(elem).parent().parent().prev();

    // remove the current question
    $current_step.removeClass("show");
    // show the next question
    $next_step.addClass("show");
    // change the progress on the progress bar
    $("#progressbar li").eq(Number(step_num) - 1).removeClass("active");

    // animate the current step being removed and the next appearing
    $current_step.animate({}, {
        step: function() {
            $current_step.css({
                'display': 'none',
                'position': 'relative'
            });
            $current_step.css({
                'display': 'block'
            });
        }
    });
}


$(function() {

    $(".next").on("click", function() { next_step(this, $(this).attr('num')) });
    $(".prev").on("click", function() { prev_step(this, $(this).attr('num')) });

    for (var i = 0; i < 7; i++) {
        $(`#q${i}-y`).change(function() { if (this.checked) $(`#q${i}-extra`).css({ "display": "block" }) })
        $(`#q${i}-n`).change(function() { if (this.checked) $(`#q${i}-extra`).css({ "display": "none" }) })
    }
});