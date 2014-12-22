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
    
    plugins.Geoloc = {

		NAVIGATOR_GEOLOCATION_AJAX : null,
		callBackData : null,		
		
        init : function() {
			var ajaxUrls = context.urls;
			for(var i = 0; i < ajaxUrls.length; i++){
				if(ajaxUrls[i].code == 'NAVIGATOR_GEOLOCATION_AJAX'){
					NAVIGATOR_GEOLOCATION_AJAX = ajaxUrls[i];
				}
			}
        },
		
        geoloc : function() {	
			$.geolocation(function(lat,lng){
				var params = "latitude=" + lat + "&longitude=" + lng;		
				$.ajax({
					url: NAVIGATOR_GEOLOCATION_AJAX.url,
					type: NAVIGATOR_GEOLOCATION_AJAX.method,
					data: params,
					success : function(data) {
						location.reload();
					},
					error : function(data) {
						/* */
					}
				});
				
			});
        }

    };
    
})( window.plugins = window.plugins || {} );
