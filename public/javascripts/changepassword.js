$(document).ready(function(){
    $('#lateform').submit(function(e) {
        if ($.trim($("#pass").val()) === "" ) {
            e.preventDefault();
            iziToast.warning({timeout:6000,position: "center", title: 'Attention', message: 'Entrez un mot de passe svp!!'});
            //You can return false here as well
        }
    });
})
