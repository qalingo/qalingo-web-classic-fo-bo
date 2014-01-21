(function($){
	var _DEFAULTS = {
		controls: {
			pageSize: ".pageSize",
			sortBy: ".sortBy",
			order: ".order",
			text: "#search-form input[name=text]",
			form: "#search-form",
			priceRange: "#price-slider",
			filter: "#search-filter"
		},
		params: {
			pageSize: 9,
			page: 1,
			order: "asc",
			sortBy: "name",
			text: "",
			"price.start": "",
			"price.end": ""
		}		
	},	
	_settings = {};
	
	var _bindEvents = function(){
		$(_settings.controls.pageSize).change(_onPageSizeChange);
		$(_settings.controls.sortBy).change(_onSortByChange);
		$(_settings.controls.order).click(_onOrderChange);
		$(_settings.controls.form).submit(_onSearchFormSubmit);
		$(_settings.controls.filter).click(_onSearchFilter);
	},
	_onSearchFilter = function(){
		var $form = $(_settings.controls.form);
		$form.find("input#priceStartParam").val(_getPriceStart());
		$form.find("input#priceEndParam").val(_getPriceEnd());
		$form.submit();
	},
	_onOrderChange = function(){
		_settings.params.order = $(this).attr("rel");
		_submitSearchForm();
	},
	_onSortByChange = function(){
		_settings.params.sortBy = $(this).find("option:checked").val();
		_submitSearchForm();
	},
	_onPageSizeChange = function(){
		_settings.params.pageSize = $(this).find("option:checked").val();
		_submitSearchForm();
	},
	_onSearchFormSubmit = function(){
		var $form = $(this);
		$form.find("input[name=pageSize]").val(_settings.params.pageSize);
		$form.find("input[name=order]").val(_settings.params.order);
		$form.find("input[name=sortBy]").val(_settings.params.sortBy);
		$form.find("input[name=page]").val(_settings.params.page);
		return true;
	},
	_submitSearchForm = function(){
		$(_settings.controls.form).submit();
	},
	_getPriceStart = function(){
		var value = $(_settings.controls.priceRange).data('slider').getValue();
		return value[0];
	},
	_getPriceEnd = function(){
		var value = $(_settings.controls.priceRange).data('slider').getValue();
		return value[1];
	};
	
	$.qalingo = function(){};	
	
	$.qalingo.search = function(options){
		_settings = $.extend({}, _DEFAULTS, options);
		_bindEvents();
	};
})(jQuery);