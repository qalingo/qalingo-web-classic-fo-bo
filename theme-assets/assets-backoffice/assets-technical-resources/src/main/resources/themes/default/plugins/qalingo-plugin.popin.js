/*
 * Most of the code in the Qalingo project is copyrighted Hoteia and licensed
 * under the Apache License Version 2.0 (release version 0.8.0)
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *                   Copyright (c) Hoteia, 2012-2014
 * http://www.hoteia.com - http://twitter.com/hoteia - contact@hoteia.com
 *
 */
(function( plugins ) {
    
    plugins.Popin = {	
		
        init : function() {
			if($('.trigger-popin').length > 0){
				$(".close-popin").hover(
					function() {
						$('span.ecs_tooltip').show();
					},
					function () {
						$('span.ecs_tooltip').hide();
					}
				);
				
				$(".close-popin").on('click', function() {
					plugins.Popin.disablePopin($(this).parent());
				});
				
				$(this).keyup(function() {
					if (event.which == 27) { 
						if($(this).attr('data-attribute-status') == '1'){
							plugins.Popin.disablePopin($(this));
						}
					}  	
				});
												
				$("#background-popin").on('click', function() {
					$(".trigger-popin").each(function( index ) {
						if($(this).attr('data-attribute-status') == '1'){
							plugins.Popin.disablePopin($(this));
						}
					});
				});
			}
			
        },
		
        loading : function() {
			$(".loader-popin").show();  
        },

        closeloading : function() {
			$(".loader-popin").fadeOut('normal');
        },

        loadPopin : function(popin) {
			var popinStatus = popin.attr('data-attribute-status');
			if(popinStatus == 0) {
				plugins.Popin.closeloading();
				popin.fadeIn(0500);
				$("#background-popin").css("opacity", "0.7");
				$("#background-popin").fadeIn(0001); 
				popin.attr('data-attribute-status', 1);
			}
        },

        disablePopin : function(popin) {
			var popinStatus = popin.attr('data-attribute-status');
			if(popinStatus == 1) {
				popin.fadeOut("normal");  
				$("#background-popin").fadeOut("normal");  
				popin.attr('data-attribute-status', 0);
			}
        }
				
    };
    
})( window.plugins = window.plugins || {} );
