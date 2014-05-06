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
    
    plugins.AddToWishlist = {

		ADD_TO_WISHLIST_AJAX : null,
		callBackData : null,		
		
        init : function() {
			if($('#add-wishlist-popup').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'ADD_TO_WISHLIST_AJAX'){
						ADD_TO_WISHLIST_AJAX = ajaxUrls[i];
					}
				}
					
				$('.trigger-add-to-wishlist').on('click', function() {
					var skuCode = $(this).attr('data-value-sku-code');
					plugins.AddToWishlist.addToWishlistButtonAjax(skuCode);
				});
			}
        },
		
        addToWishlistButtonAjax : function(skuCode) {	
			var params = "product-sku-code=" + skuCode;
			plugins.Popin.loading();
			$.ajax({
				url: ADD_TO_WISHLIST_AJAX.url,
				type: ADD_TO_WISHLIST_AJAX.method,
				data: params,
				success : function(data) {
					callBackData = data;
					setTimeout(function(){ plugins.Popin.loadPopin($("#add-wishlist-popup")); }, 500);
					plugins.AddToWishlist.displaySuccessAddToWishlistCallBack();
					plugins.Popin.loadPopin($("#add-wishlist-popup"));
				},
				error : function(data) {
					callBackData = data;
					setTimeout(function(){ plugins.Popin.loadPopin($("#add-wishlist-popup")); }, 500);
					plugins.AddToWishlist.displayErrorAddToWishlistCallBack();
					plugins.Popin.loadPopin($("#add-wishlist-popup"));
				}
			});
        },
		
        displaySuccessAddToWishlistCallBack : function() {
		
			var _initTemplate = function(templateId, templateName){
				templateId = "#" + templateId;
				$.templates(templateName, templateId);
			};
	
			_initTemplate("addToWishlistProductContent", "addToWishlistProductContent");
			var htmlContent = $.render.addToWishlistProductContent(callBackData);
				
			$('#add-wishlist-popup #popup_content').html(htmlContent);
			
			$('.add-to-wishlist-continue').on('click', function() {
				plugins.Popin.disablePopin($("#add-wishlist-popup"));
			});
			
		},
		
        displayErrorAddToWishlistCallBack : function() {

			var _initTemplate = function(templateId, templateName){
				templateId = "#" + templateId;
				$.templates(templateName, templateId);
			};
	
			_initTemplate("addToWishlistProductContent", "addToWishlistProductContent");
			var htmlContent = $.render.addToWishlistProductContent(callBackData);
				
			$('#add-wishlist-popup #popup_content').html(htmlContent);
			
			$('.add-to-wishlist-continue').on('click', function() {
				plugins.Popin.disablePopin($("#add-wishlist-popup"));
			});
			
		}

    };
    
})( window.plugins = window.plugins || {} );
