$(".editmovie").hide();
$(".addmovie").hide();

$("#showedit").click(() => {
    $(".addmovie").fadeOut();
    $(".editmovie").fadeIn("slow");
});

$("#showadd").click(() => {
    $(".editmovie").fadeOut();
    $(".addmovie").fadeIn("slow");
});


$('#search').keypress(function(event){
    var searchstring = $('#search').val();
    if (event.keyCode == 13) {
        window.location.replace("http://localhost:3000/" + searchstring);
    }
});