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
    
    plugins.ChangeContext = {

        init : function() {
			if($('#change-context-popup').length > 0){
				$('.trigger-change-context').on('click', function() {
					plugins.ChangeContext.displayChangeContext();
				});
			}
        },
		
        displayChangeContext : function() {
			setTimeout(function(){ plugins.Popin.loadPopin($("#change-context-popup")); }, 500);

			var _initTemplate = function(templateId, templateName){
				templateId = "#" + templateId;
				$.templates(templateName, templateId);
			};
	
			_initTemplate("change-context-content", "changeContextContent");
			var htmlContent = $.render.changeContextContent();
				
			$('#change-context-popup #popup_content').html(htmlContent);
			
			$('.change-context-continue').on('click', function() {
				plugins.Popin.disablePopin($("#change-context-popup"));
			});
			
			plugins.Popin.loadPopin($("#change-context-popup"));
			
		}
		
    };
    
})( window.plugins = window.plugins || {} );
