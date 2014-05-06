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
    
    plugins.AddToCart = {

		ADD_TO_CART_AJAX : null,
		callBackData : null,		
		
        init : function() {
			if($('#add-cart-popup').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'ADD_TO_CART_AJAX'){
						ADD_TO_CART_AJAX = ajaxUrls[i];
					}
				}
					
				$('.trigger-add-to-cart').on('click', function() {
					var catalogCategoryCode = $(this).attr('data-value-catalog-category-code');
					var skuCode = $(this).attr('data-value-sku-code');
					var quantity = $(this).attr('data-value-sku-quantity');
					plugins.AddToCart.addToCartButtonAjax(catalogCategoryCode, skuCode , quantity);
				});
			}
        },
		
        addToCartButtonAjax : function(catalogCategoryCode, skuCode, quantity) {	
			var params = "category-code=" + catalogCategoryCode + "&product-sku-code=" + skuCode + "&quantity=" + quantity;		
			plugins.Popin.loading();
			$.ajax({
				url: ADD_TO_CART_AJAX.url,
				type: ADD_TO_CART_AJAX.method,
				data: params,
				success : function(data) {
					callBackData = data;
					setTimeout(function(){ plugins.Popin.loadPopin($("#add-cart-popup")); }, 500);
					plugins.AddToCart.displaySuccessAddToCartCallBack();
					plugins.Popin.loadPopin($("#add-cart-popup"));
				},
				error : function(data) {
					callBackData = data;
					setTimeout(function(){ plugins.Popin.loadPopin($("#add-cart-popup")); }, 500);
					plugins.AddToCart.displayErrorAddToCartCallBack();
					plugins.Popin.loadPopin($("#add-cart-popup"));
				}
			});
        },
		
        displaySuccessAddToCartCallBack : function() {
			$('#header-cart-status').html('&nbsp;<i class="fa fa-shopping-cart"></i><a href="' + callBackData.checkoutShoppingCartUrl + '" alt="" style="padding-left:3px;">' + callBackData.checkoutShoppingCartHeaderLabel + '</a>');
			
			var _initTemplate = function(templateId, templateName){
				templateId = "#" + templateId;
				$.templates(templateName, templateId);
			};
	
			_initTemplate("addToCartProductContent", "addToCartProductContent");
			var htmlContent = $.render.addToCartProductContent(callBackData);
				
			$('#add-cart-popup #popup_content').html(htmlContent);
			
			$('.add-to-cart-continue').on('click', function() {
				plugins.Popin.disablePopin($("#add-cart-popup"));
			});
			
		},
		
        displayErrorAddToCartCallBack : function() {
		
			var _initTemplate = function(templateId, templateName){
				templateId = "#" + templateId;
				$.templates(templateName, templateId);
			};
	
			_initTemplate("addToCartProductContent", "addToCartProductContent");
			var htmlContent = $.render.addToCartProductContent(callBackData);
				
			$('#add-cart-popup #popup_content').html(htmlContent);
			
			$('.add-to-cart-continue').on('click', function() {
				plugins.Popin.disablePopin($("#add-cart-popup"));
			});
			
		}

    };
    
})( window.plugins = window.plugins || {} );
