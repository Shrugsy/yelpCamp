// this is for when editing profile in order to check that new password fields match
let p1 = $('#p1');
let p2 = $('#p2');

p1.on('input', ()=>{
    checkPasswordsMatch();
})
p2.on('input', ()=>{
    checkPasswordsMatch();
})

function checkPasswordsMatch() {
    if (p1.val() !== p2.val()){
        $('#passwordTooltip').tooltip('show');
        return false;
    } else {
        $('#passwordTooltip').tooltip('hide');
        return true;
    }
}

// activate tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })