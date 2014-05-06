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
    
    plugins.AddProductToCatalogCategory = {

		GET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX : null,
		SET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX : null,
		callBackData : null,		
		catalogType : null,
		
        init : function() {
			if($('#add-product-to-catalog-category-popup').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'GET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX'){
						GET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX = ajaxUrls[i];
					} else if(ajaxUrls[i].code == 'SET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX'){
						SET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX = ajaxUrls[i];
					}
				}
				
				catalogType = $('#catalog-tree').attr('data-catalog-type');
				$('.trigger-add-product-to-category').on('click', function() {
					var categoryCode = $(this).attr('data-category-code');
					plugins.AddProductToCatalogCategory.addProductToCategoryGetProductListAjax(categoryCode);
				});
			}
        },
		
		addProductToCategoryGetProductListAjax : function(categoryCode) {	
			var params = "category-code=" + categoryCode + "&" + "catalog-type=" + catalogType;
			plugins.Popin.loading();
			$.ajax({
				url: GET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX.url,
				type: GET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX.method,
				data: params,
				success : function(data) {
					callBackData = data;
					setTimeout(function(){ plugins.Popin.loadPopin($("#add-product-to-catalog-category-popup")); }, 500);
					plugins.AddProductToCatalogCategory.displayPopinForm();
					plugins.Popin.loadPopin($("#add-product-to-catalog-category-popup"));
				},
				error : function(data) {
					callBackData = data;
					setTimeout(function(){ plugins.Popin.loadPopin($("#add-product-to-catalog-category-popup")); }, 500);
					plugins.AddProductToCatalogCategory.displayPopinForm();
					plugins.Popin.loadPopin($("#add-product-to-catalog-category-popup"));
				}
			});
        },
		
        displayPopinForm : function() {	
			var _initTemplate = function(templateId, templateName){
				templateId = "#" + templateId;
				$.templates(templateName, templateId);
			};
	
			_initTemplate("addProductToCategoryContent", "addProductToCategoryContent");
			var htmlContent = $.render.addProductToCategoryContent(callBackData);
				
			$('#add-product-to-catalog-category-popup #popup_content').html(htmlContent);
			
			$("ul.trigger-product-list-paging").quickPager({pagerLocation:"both"});
			
			$('.trigger-cancel-button').on('click', function() {
				plugins.Popin.disablePopin($("#add-product-to-catalog-category-popup"));
			});
			
			$('.trigger-product-marketing-checkbox').on('click', function() {
				if($(this).is(':checked')){
					$(this).parent().find(".product-sku input[type=checkbox]").each(function () {
						$(this).prop( "checked", true );
					});
					$(this).parent().find("ul").each(function () {
						$(this).css("display", "block");
					});
					
				} else {
					$(this).parent().find(".product-sku input[type=checkbox]").each(function () {
						$(this).prop( "checked", false );
					});
				}
			});
			
			$('.trigger-submit-product-selection').on('click', function() {
				var categoryCode = $(this).attr('data-category-code');
				plugins.AddProductToCatalogCategory.setProductToCategoryGetProductListAjax(categoryCode);
				plugins.Popin.disablePopin($("#add-product-to-catalog-category-popup"));
			});
        },
		
		setProductToCategoryGetProductListAjax : function(categoryCode) {
			var skuList = "";
			$("#product-list-paging input[type=checkbox]").each(function () {
				if($(this).attr('name') == 'productSkus'){
					if($(this).is(':checked')){
						skuList += $(this).val()  + ";";
					}
				}
			});
			if(skuList.length > 0){
				skuList = skuList.substr(0, skuList.length -1); 
			}
			var params = "category-code=" + categoryCode + "&" + "catalog-type=" + catalogType + "&sku-codes=" + skuList;		
			$.ajax({
				url: SET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX.url,
				type: SET_PRODUCT_LIST_FOR_CATALOG_CATEGORY_AJAX.method,
				data: params,
				success : function(data) {
					callBackData = data;
					plugins.CatalogTree.loadProductListAjax(categoryCode);
				},
				error : function(data) {
					callBackData = data;
					plugins.CatalogTree.loadProductListAjax(categoryCode);
				}
			});
		},

    };
    
})( window.plugins = window.plugins || {} );
