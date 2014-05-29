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
				$('#cart-delivery-methods').hide();
				$('#cart-taxes').hide();
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
					}
				}
				plugins.FormCart.loadCartAjax();
			}

			if($('#checkout-addresses').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'SET_SHIPPING_ADDRESS_AJAX'){
						SET_SHIPPING_ADDRESS_AJAX = ajaxUrls[i];
					} else if(ajaxUrls[i].code == 'SET_BILLING_ADDRESS_AJAX'){
						SET_BILLING_ADDRESS_AJAX = ajaxUrls[i];
					} 
				}
				plugins.FormCart.loadAddressesAjax();
			}
			
			if($('#delivery-methods').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'SET_DELIVERY_METHOD_AJAX'){
						SET_DELIVERY_METHOD_AJAX = ajaxUrls[i];
					}
				}
				plugins.FormCart.loadDeliveryMethodsAjax();
			}
			
        },
		
        loadCartAjax : function() {			
			$.ajax({
				url: GET_CART_AJAX.url,
				type: GET_CART_AJAX.method,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadCartHtml(data);
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
					plugins.FormCart.loadCartHtml(data);
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
					plugins.FormCart.loadCartHtml(data);
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
					plugins.FormCart.loadCartHtml(data);
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },
		
        loadAddressesAjax : function() {			
			plugins.FormCart.loadAddressesHtml();
        },
		
        setBillingAddressAjax : function(addressGuid) {			
			var params = "cart-billing-address-guid=" + addressGuid;
			$.ajax({
				url: SET_BILLING_ADDRESS_AJAX.url,
				type: SET_BILLING_ADDRESS_AJAX.method,
				data: params,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadDeliveryMethodsHtml(data);
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },
		
        setShippingAddressAjax : function(addressGuid) {			
			var params = "cart-shipping-address-guid=" + addressGuid;
			$.ajax({
				url: SET_SHIPPING_ADDRESS_AJAX.url,
				type: SET_SHIPPING_ADDRESS_AJAX.method,
				data: params,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadDeliveryMethodsHtml(data);
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },
		
        loadDeliveryMethodsAjax : function() {			
			$.ajax({
				url: GET_CART_AJAX.url,
				type: GET_CART_AJAX.method,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadDeliveryMethodsHtml(data);
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },
		
        setDeliveryMethodAjax : function(deliveryMethodCode) {			
			var params = "cart-delivery-method-code=" + deliveryMethodCode;
			$.ajax({
				url: SET_DELIVERY_METHOD_AJAX.url,
				type: SET_DELIVERY_METHOD_AJAX.method,
				data: params,
				success : function(data) {
					checkoutData = data;
					plugins.FormCart.loadCartHtml(data);
					plugins.FormCart.loadDeliveryMethodsHtml(data);
				},
				error : function(data) {
					checkoutData = data;
				}
			});
        },
		
		loadCartHtml : function(data) {
			var cartErrorsHtml = '';
			for(var i = 0; i < data.errorMessages.length; i++){
				var error = data.errorMessages[i];
				cartErrorsHtml += '<p id="' + error.id + '">' + error.message + '</p>';
			}			
			$('#error-messages').html(cartErrorsHtml);

			var cartItemsHtml = '';
			if(data.cart != null){
				var withActions = $('#cart-items').attr('with-actions') == null ? false : $('#cart-items').attr('with-actions');
				for(var i = 0; i < data.cart.cartItems.length; i++){
					var item = data.cart.cartItems[i];
					cartItemsHtml += '<tr>';				
					cartItemsHtml += '<td style="padding-top: 15px;"><a href="' + item.productDetailsUrl + '" alt="' + item.i18nName + '" target="_blank" class="checkout-common-link"><img src="' + item.summaryImage + '" alt="' + item.i18nName + '" class="cart-item-image"/></a></td>';
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
			$('#cart-items-total').html(data.cart.cartItemTotalWithStandardCurrencySign);
			
			var cartDeliveyMethods = '';
			if(data.cart != null && data.cart.deliveryMethods != null && data.cart.deliveryMethods.length > 0){
				for(var i = 0; i < data.cart.deliveryMethods.length; i++){
					var deliveryMethod = data.cart.deliveryMethods[i];
					cartDeliveyMethods += '<tr>';
					cartDeliveyMethods += '<td style="text-align: right;">' + deliveryMethod.name + ' (' + deliveryMethod.arrivalTime + ')</td>';
					cartDeliveyMethods += '<td style="text-align: right;">' + deliveryMethod.priceWithStandardCurrencySign + '</td>';
					cartDeliveyMethods += '</tr>';
				}
				$('#cart-delivery-methods').find( "tbody" ).html(cartDeliveyMethods);
				$('#cart-delivery-methods').show();
				$('#cart-delivery-methods-total').html(data.cart.deliveryMethodTotalWithStandardCurrencySign);
			}

			if(data.cart != null && data.cart.taxes != null && data.cart.taxes.length > 0){
				for(var i = 0; i < data.cart.taxes.length; i++){
					var taxe = data.cart.taxes[i];
					cartDeliveyMethods += '<tr>';
					cartDeliveyMethods += '<td style="text-align: right;">' + taxe.name + '</td>';
					cartDeliveyMethods += '<td style="text-align: right;">' + taxe.priceWithStandardCurrencySign + '</td>';
					cartDeliveyMethods += '</tr>';
				}
				$('#cart-taxes').find( "tbody" ).html(cartDeliveyMethods);
				$('#cart-taxes').show();
				$('#cart-taxes-methods-total').html(data.cart.taxTotalWithStandardCurrencySign);
			}			

			$('#cart-total-amount').html(data.cart.cartTotalWithStandardCurrencySign);

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
		
		loadAddressesHtml : function() {
			$('#billing-address').change('click', function() {
				var addressGuid = $(this).val();
				plugins.FormCart.setBillingAddressAjax(addressGuid);
			});
        },
		
		loadDeliveryMethodsHtml : function(data) {
			var deliveyMethods = '';
			if(data.cart != null){		
				for(var i = 0; i < data.deliveryMethodInformations.length; i++){
					var deliveryMethodInformation = data.deliveryMethodInformations[i];
					for(var j = 0; j < deliveryMethodInformation.availableDeliveryMethods.length; j++){
						var deliveryMethod = deliveryMethodInformation.availableDeliveryMethods[j];
						deliveyMethods += '<tr>';
						if(deliveryMethod.selected){
							deliveyMethods += '<td style="text-align: left; padding-right:10px; padding-bottom:10px"><input type="radio" id="' + deliveryMethod.code + '" name="deliveryMethod" value="' + deliveryMethod.code + '" class="trigger-delivery-method" checked="checked"></td>';
						} else {
							deliveyMethods += '<td style="text-align: left; padding-right:10px; padding-bottom:10px"><input type="radio" id="' + deliveryMethod.code + '" name="deliveryMethod" value="' + deliveryMethod.code + '" class="trigger-delivery-method"></td>';
						}
						deliveyMethods += '<td style="text-align: left;">' + deliveryMethod.name + '</td>';
						deliveyMethods += '<td style="text-align: left;">' + deliveryMethod.arrivalTime + '</td>';
						deliveyMethods += '<td style="text-align: right;">' + deliveryMethod.priceWithStandardCurrencySign + '</td>';
						deliveyMethods += '</tr>';
					}
				}
			}
			$('#delivery-methods').html(deliveyMethods);
			
			$('.trigger-delivery-method').on('click', function() {
				var deliveryMethodCode = $(this).val();
				plugins.FormCart.setDeliveryMethodAjax(deliveryMethodCode);
			});
			
        },
    };
    
})( window.plugins = window.plugins || {} );
