(function( plugins ) {
    
    plugins.AddProductToCatalogCategory = {

		ADD_TO_CART_AJAX : null,
		callBackData : null,		
		
        init : function() {
			if($('#add-product-to-catalog-category-popup').length > 0){					
				$('.trigger-add-product-to-category').on('click', function() {
					plugins.AddProductToCatalogCategory.displayPopinForm();
				});
			}
        },
		
        displayPopinForm : function() {	
			plugins.Popin.loading();
			setTimeout(function(){ plugins.Popin.loadPopin($("#add-product-to-catalog-category-popup")); }, 500);
			plugins.Popin.loadPopin($("#add-product-to-catalog-category-popup"));
        }

    };
    
})( window.plugins = window.plugins || {} );
