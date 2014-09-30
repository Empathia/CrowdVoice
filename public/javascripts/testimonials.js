$(function() {
		var step = 3; 
		var current = 0; 
		var maximum = $('.cites-list > li').size(); 
		var visible = 3; 
		var speed = 700; 
		var liSize = 219;
		var carousel_height = 280;
 
 
		var ulSize = liSize * maximum;   
		var divSize = liSize * visible;  
 
		$('.cites-list').css("width", ulSize+"px").css("left", -(current * liSize)).css("position", "absolute");
 
		$('.cite-slide').css("width", "690px").css("height", carousel_height+"px").css("visibility", "visible").css("overflow", "hidden").css("position", "relative"); 
 
		$('.cite-slide-right-arrow').click(function() { 
			if(current + step < 0 || current + step > maximum - visible) {return; }
			else {
				current = current + step;
				$(this).parent().next('.cites-list').animate({left: -(liSize * current)}, speed, null);
			}
			return false;
		});
 
		$('.cite-slide-left-arrow').click(function() { 
			if(current - step < 0 || current - step > maximum - visible) {return; }
			else {
				current = current - step;
				$(this).parent().next().next('.cites-list').animate({left: -(liSize * current)}, speed, null);
			}
			return false;
		});
    
});

