(function($){
	var _DEFAULTS = {
		controls: {
			tab: ".tab",
			tabContent: ".product-spec-content",
			reviewButton: ".review-rating-star",
			form: "#productCommentForm",		
			submitButton: "#submit-button-zone button"
		},
		params: {
			qualityOfService: "",
			ratioQualityPrice: "",
			priceScore: "",
			comment: "",
			productCode: ""
		},
		activeTab: "#features",
		submitButtonZone: "#submit-button-zone"
	},
	_settings = {},
	_bindEvents = function(){
		$(_settings.controls.tab).click(_chooseTab);
		$(_settings.controls.form).submit(_onFormSubmit);
		$(_settings.controls.reviewButton).click(_review);
		$(_settings.controls.submitButton).click(_submitForm);
	},
	_chooseTab = function(){
		$(_settings.controls.tab).parent().removeClass("active");
		$(this).parent().addClass("active");
		
		$(_settings.controls.tabContent).hide();
		var currentTab = $(this).attr("href");			
		$(currentTab).show();
		return false;
	},
	_review = function(){
		var value = $(this).data("star") + "";
		var type = $(this).data("type");
		
		if(type == "quality"){
			_settings.params.qualityOfService = value;
			var $star = $("#product-quality-rating");
			var currentValue = $star.data("star");
			$star.removeClass("star-"+currentValue).addClass("star-"+value);
		}else if(type == "price"){
			_settings.params.ratioQualityPrice = value;
			var $star = $("#product-price-rating");
			var currentValue = $star.data("star");
			$star.removeClass("star-"+currentValue).addClass("star-"+value);
		}else if(type = "value"){
			_settings.params.priceScore = value;
			var $star = $("#product-value-rating");
			var currentValue = $star.data("star");
			$star.removeClass("star-"+currentValue).addClass("star-"+value);
		}						
		
		//_submitForm();
		$(_settings.submitButtonZone).show();
		
		return false;
	},
	_onFormSubmit = function(){
		var $form = $(_settings.controls.form);
		$form.find("input#productCommentForm_qualityOfService").val(_settings.params.qualityOfService);
		$form.find("input#productCommentForm_ratioQualityPrice").val(_settings.params.ratioQualityPrice);
		$form.find("input#productCommentForm_priceScore").val(_settings.params.priceScore);
//		$form.find("input[name=page]").val(_settings.params.page);
//		$form.find("input[name=categoriesFilter]").val(_getCatalogCategories());
		
		return true;
	},
	_submitForm = function(){
		$(_settings.controls.form).submit();
	};
	
	$.product = function(){};
	
	$.product.details = function(options){
		_settings = $.extend({}, _DEFAULTS, options);
		_bindEvents();
	};
})(jQuery);