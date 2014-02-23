(function( plugins ) {
    
    plugins.CatalogTree = {

        GET_PRODUCT_LIST_AJAX : null,
		
        init : function() {
			if($('#cart-summary-content').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'GET_PRODUCT_LIST_AJAX'){
						GET_PRODUCT_LIST_AJAX = ajaxUrls[i];
					}
				}
				plugins.CatalogTree.loadCartAjax();
			}			
        },
		
        loadCartAjax : function() {			
			$.ajax({
				url: GET_CART_AJAX.url,
				type: GET_CART_AJAX.method,
				success : function(data) {
					checkoutData = data;
					plugins.CatalogTree.loadCartHtml();
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
				var withActions = $('#cart-items').attr('with-actions') == null ? false : $('#cart-items').attr('with-actions');
				for(var i = 0; i < checkoutData.cart.cartItems.length; i++){
					var item = checkoutData.cart.cartItems[i];
					cartItemsHtml += '<tr>';				
					cartItemsHtml += '<td style="padding-top: 15px;"><a href="' + item.productDetailsUrl + '" alt="' + item.i18nName + '" target="_blank" class="product-image checkout-common-link"><span><img src="' + item.summaryImage + '" alt="' + item.i18nName + '" /></span></a></td>';
					cartItemsHtml += '<td><a href="' + item.productDetailsUrl + '" alt="' + item.i18nName + '" target="_blank" class="checkout-common-link">' + item.i18nName + '</a></td>';
					cartItemsHtml += '<td style="text-align: center;"><a href="' + item.productDetailsUrl + '" alt="' + item.i18nName + '" target="_blank" class="checkout-common-link">' + item.productSkuCode + '</a></td>';
					if(withActions == 'true'){
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
					} else {
						cartItemsHtml += '<td style="text-align: center;">' + item.quantity + '</td>';
					}
					cartItemsHtml += '<td style="text-align: right;">' + item.priceWithStandardCurrencySign + '</td>';
					cartItemsHtml += '<td style="text-align: right;">' + item.totalAmountWithStandardCurrencySign + '</td>';
					cartItemsHtml += '</tr>';
				}
			}
			$('#cart-items').find( "tbody" ).html(cartItemsHtml);
			$('#cart-items-total').html(checkoutData.cart.cartItemTotalWithStandardCurrencySign);
			
			var cartDeliveyMethods = '';
			if(checkoutData.cart != null && checkoutData.cart.deliveryMethods != null && checkoutData.cart.deliveryMethods.length > 0){
				for(var i = 0; i < checkoutData.cart.deliveryMethods.length; i++){
					var deliveryMethod = checkoutData.cart.deliveryMethods[i];
					cartDeliveyMethods += '<tr>';
					cartDeliveyMethods += '<td style="text-align: right;">' + deliveryMethod.name + ' (' + deliveryMethod.arrivalTime + ')</td>';
					cartDeliveyMethods += '<td style="text-align: right;">' + deliveryMethod.priceWithStandardCurrencySign + '</td>';
					cartDeliveyMethods += '</tr>';
				}
				$('#cart-delivery-methods').find( "tbody" ).html(cartDeliveyMethods);
				$('#cart-delivery-methods').show();
				$('#cart-delivery-methods-total').html(checkoutData.cart.deliveryMethodTotalWithStandardCurrencySign);
			}

			if(checkoutData.cart != null && checkoutData.cart.taxes != null && checkoutData.cart.taxes.length > 0){
				for(var i = 0; i < checkoutData.cart.taxes.length; i++){
					var taxe = checkoutData.cart.taxes[i];
					cartDeliveyMethods += '<tr>';
					cartDeliveyMethods += '<td style="text-align: right;">' + taxe.name + '</td>';
					cartDeliveyMethods += '<td style="text-align: right;">' + taxe.priceWithStandardCurrencySign + '</td>';
					cartDeliveyMethods += '</tr>';
				}
				$('#cart-taxes').find( "tbody" ).html(cartDeliveyMethods);
				$('#cart-taxes').show();
				$('#cart-taxes-methods-total').html(checkoutData.cart.taxTotalWithStandardCurrencySign);
			}			

			$('#cart-total-amount').html(checkoutData.cart.cartTotalWithStandardCurrencySign);

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
