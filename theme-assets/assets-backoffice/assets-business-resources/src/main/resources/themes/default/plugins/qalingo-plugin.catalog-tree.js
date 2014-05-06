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
    
    plugins.CatalogTree = {

        GET_CATALOG_AJAX : null,
        GET_PRODUCT_LIST_AJAX : null,

        catalogData : null,
        catalogType : null,
		
        init : function() {
			if($('#catalog-tree').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'GET_CATALOG_AJAX'){
						GET_CATALOG_AJAX = ajaxUrls[i];
					}
					if(ajaxUrls[i].code == 'GET_PRODUCT_LIST_AJAX'){
						GET_PRODUCT_LIST_AJAX = ajaxUrls[i];
					}
				}
				
				catalogType = $('#catalog-tree').attr('data-catalog-type');
				plugins.CatalogTree.loadCatalogAjax(catalogType);
				
			}			
        },
		
		loadCatalogAjax : function(catalogType) {
			var params = "catalog-type=" + catalogType;
			$.ajax({
				url: GET_CATALOG_AJAX.url,
				type: GET_CATALOG_AJAX.method,
				data: params,
				success : plugins.CatalogTree.loadCatalogHtml
				/*
				error : function(data) {
					catalogData = data;
				}
				*/
			});
        },

        loadCatalogHtml : function(catalog) {
			$("#add-root-category").attr('href', catalog.addRootCategoryUrl);
		
			var html = '<li><a href="#' + catalog.code + '">' + catalog.name + '</a><ul>';
			var  catalogCategories = catalog.sortedRootCatalogCategories;
			html = html + plugins.CatalogTree.loadCatalogCategoryTree(catalogCategories);
			html = html + '</ul></li>';
			$('#catalog-tree').html(html);
			
			$('.find-products').on('click', function() {
				var categoryCode = $(this).attr('data-category-code');
				plugins.CatalogTree.loadProductListAjax(categoryCode);
			});
		},
		
        loadCatalogCategoryTree : function(catalogCategories) {
			var html =	'';
			for(var i = 0; i < catalogCategories.length; i++){
				var category = catalogCategories[i];
				html = html + '<li><a href="#" class="find-products" data-category-code="' + category.code + '">' + category.name + '</a>';
				if(category.sortedChildCatalogCategories != null && category.sortedChildCatalogCategories.length > 0){
					html = html + '<ul>' + plugins.CatalogTree.loadCatalogCategoryTree(category.sortedChildCatalogCategories) + '</ul>';
				}
				html = html + '</li>';
			}
			return html;
		},
		
		loadProductListAjax : function(categoryCode) {
			var params = "category-code=" + categoryCode + "&" + "catalog-type=" + catalogType;
			$.ajax({
				url: GET_PRODUCT_LIST_AJAX.url,
				type: GET_PRODUCT_LIST_AJAX.method,
				data: params,
				success : plugins.CatalogTree.loadProductListHtml
				/*
				error : function(data) {
					catalogData = data;
				}
				*/
			});
        },
		
        loadProductListHtml : function(category) {
			$('#header-category-details').html($("#HeaderCategoryDetailsContent").render(category));
			$('#product-list').html($("#ProductListContent").render(category));
			$('.trigger-show-skus').on('click', function() {
				// RESET ALL
				$(".product-item").css("height", "35px");
				$(".sku-list").css("display", "none");
				
				// SET SPECIFIC ITEM
				var countSkuItem = $(this).parents(".product-item").find(".sku-list .sku-item").length;
				var productItemHeight = 35 + countSkuItem * 35;
				$(this).parents(".product-item").css("height", productItemHeight + "px");
				$(this).parents(".product-item").find(".sku-list").css("display", "block");
			});
			
			plugins.AddProductToCatalogCategory.init();
		},
		
    };
    
})( window.plugins = window.plugins || {} );
