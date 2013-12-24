(function( plugins ) {
    
    plugins.FormCart = {

        GET_CART_AJAX : null,
		UPDATE_CART_ITEM_AJAX : null,
        DELETE_CART_ITEM_AJAX : null,
        APPLY_PROMO_CODE_AJAX : null,
        SET_SHIPPING_ADDRESS_AJAX : null,
        SET_BILLING_ADDRESS_AJAX : null,
        SET_DELIVERY_METHOD_AJAX : null,
		checkoutData : null,
		
        init : function() {
			if($('#cart-summary-content').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'GET_CART_AJAX'){
						GET_CART_AJAX = ajaxUrls[i];
					} else if(ajaxUrls[i].code == 'UPDATE_CART_ITEM_AJAX'){
						UPDATE_CART_ITEM_AJAX = ajaxUrls[i];
					} else if(ajaxUrls[i].code == 'DELETE_CART_ITEM_AJAX'){
						DELETE_CART_ITEM_AJAX = ajaxUrls[i];
					} else if(ajaxUrls[i].code == 'APPLY_PROMO_CODE_AJAX'){
						APPLY_PROMO_CODE_AJAX = ajaxUrls[i];
					} else if(ajaxUrls[i].code == 'SET_SHIPPING_ADDRESS_AJAX'){
						SET_SHIPPING_ADDRESS_AJAX = ajaxUrls[i];
					} else if(ajaxUrls[i].code == 'SET_BILLING_ADDRESS_AJAX'){
						SET_BILLING_ADDRESS_AJAX = ajaxUrls[i];
					} else if(ajaxUrls[i].code == 'SET_DELIVERY_METHOD_AJAX'){
						SET_DELIVERY_METHOD_AJAX = ajaxUrls[i];
					}
				}
				plugins.FormCart.loadCartAjax();
			}
        },
		
        loadCartAjax : function() {			
			$.ajax({
				url: GET_CART_AJAX.url,
				type: GET_CART_AJAX.method,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadCartHtml();
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },

        reloadCartAjax : function() {
			plugins.FormCart.loadCartAjax();
        },
		
        updateCartItemAjax : function(productSkuCode, productQuantity) {
			var params = "cart-item-sku-code=" + productSkuCode + "&cart-item-sku-quantity=" + productQuantity;
			$.ajax({
				url: UPDATE_CART_ITEM_AJAX.url,
				type: UPDATE_CART_ITEM_AJAX.method,
				data: params,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadCartHtml();
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },
		
        deleteCartItemAjax : function(productSkuCode) {
			var params = "cart-item-sku-code=" + productSkuCode;
			$.ajax({
				url: DELETE_CART_ITEM_AJAX.url,
				type: DELETE_CART_ITEM_AJAX.method,
				data: params,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadCartHtml();
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },

        applyPromoCodeAjax : function(promoCode) {
			var params = "promo-code=" + promoCode;
			$.ajax({
				url: APPLY_PROMO_CODE_AJAX.url,
				type: APPLY_PROMO_CODE_AJAX.method,
				data: params,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadCartHtml();
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },
		
		loadCartHtml : function() {
			var cartErrorsHtml = '';
			for(var i = 0; i < checkoutData.errors.length; i++){
				var error = checkoutData.errors[i];
				cartErrorsHtml += '<p id="' + error.id + '">' + error.message + '</p>';
			}			
			$('#error-messages').html(cartErrorsHtml);

			var cartItemsHtml = '';
			if(checkoutData.cart != null){
				for(var i = 0; i < checkoutData.cart.cartItems.length; i++){
					var item = checkoutData.cart.cartItems[i];
					cartItemsHtml = '<tr>';
					cartItemsHtml += '<td style="padding-top: 15px;"><img src="' + item.summaryImage + '" alt="' + item.i18nName + '" /></td>';
					cartItemsHtml += '<td><a href="' + item.productDetailsUrl + '" alt="' + item.i18nName + '" target="_blank" class="checkout-common-link">' + item.i18nName + '</a></td>';
					cartItemsHtml += '<td style="text-align: center;"><a href="' + item.productDetailsUrl + '" alt="' + item.i18nName + '" target="_blank" class="checkout-common-link">' + item.productSkuCode + '</a></td>';
					cartItemsHtml += '<td style="text-align: center;">';
					cartItemsHtml += '<select class="cart-item-select-qty trigger-cart-item-change-quantity" data-product-sku-code="' + item.productSkuCode + '">';
					for(var j = 1; j <= context.cartMaxItemQuantity; j++){
						if(item.quantity == j){
							cartItemsHtml += '<option value="' + j + '" selected="selected">' + j + '</option> ';
						} else {
							cartItemsHtml += '<option value="' + j + '">' + j + '</option> ';
						}
					}
					cartItemsHtml += '</select>';
					cartItemsHtml += '</td>';
					cartItemsHtml += '<td style="text-align: center;"><a href="#" alt="' + item.i18nName + '" class="checkout-common-link trigger-delete-cart-item" data-product-sku-code="' + item.productSkuCode + '">remove (X)</a></td>';
					cartItemsHtml += '<td style="text-align: right;">' + item.priceWithStandardCurrencySign + '</td>';
					cartItemsHtml += '<td style="text-align: right;">' + item.totalAmountWithStandardCurrencySign + '</td>';
					cartItemsHtml += '</tr>';
				}
			}
			$('#cart-items').html(cartItemsHtml);
			
			$('#cart-items-total').html(checkoutData.cart.cartItemTotalWithStandardCurrencySign);
			$('#cart-delivery-methods-total').html(checkoutData.cart.deliveryMethodTotalWithStandardCurrencySign);
			$('#cart-taxes-methods-total').html(checkoutData.cart.taxTotalWithStandardCurrencySign);
			$('#cart-total').html(checkoutData.cart.cartTotalWithStandardCurrencySign);

			$('.trigger-delete-cart-item').on('click', function() {
				var productSkuCode = $(this).attr('data-product-sku-code');
				plugins.FormCart.deleteCartItemAjax(productSkuCode);
			});
			
			$('.trigger-cart-item-change-quantity').change('click', function() {
				var productSkuCode = $(this).attr('data-product-sku-code');
				var productSkuQuantity = $(this).val();
				plugins.FormCart.updateCartItemAjax(productSkuCode, productSkuQuantity);
			});
			
			$('.trigger-apply-promo-code').change('click', function() {
				var promoCode = $('#input-promo-code').val();
				plugins.FormCart.applyPromoCodeAjax(promoCode);
			});
			
        },
    };
    
})( window.plugins = window.plugins || {} );
