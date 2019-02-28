$( document ).ready(function() {
   
	$("#cerrar").click(function(e) {
		e.preventDefault();
        $("aside form").hide();
        $("html").css('overflow','auto');
    });
    
    $("#masInfo").click(function(e) {
		e.preventDefault();
        $("aside form").hide();
        $("html").css('overflow','auto');
    });
    
    $("#contame").click(function(e) {
		e.preventDefault();
        $("aside form").show();
        $("html").css('overflow','hidden');
    });
    
    $("#hamb").click(function(e) {
		e.preventDefault();
        $("header nav ul").toggle();
	});

});