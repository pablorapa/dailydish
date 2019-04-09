$( document ).ready(function() {
   
	$("#cerrar").click(function(e) {
		e.preventDefault();
        $(".header nav ul").hide();
        $("html").css('overflow','auto');
    });
    
    $("#hamb").click(function(e) {
		e.preventDefault();
        $(".header nav ul").show();
	});

});