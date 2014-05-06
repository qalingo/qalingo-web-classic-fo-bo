/*
 * Most of the code in the Qalingo project is copyrighted Hoteia and licensed
 * under the Apache License Version 2.0 (release version 0.8.0)
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *                   Copyright (c) Hoteia, 2012-2014
 * http://www.hoteia.com - http://twitter.com/hoteia - contact@hoteia.com
 *
 */
(function($){
	var _DEFAULTS = {
		controls: {
			pageSize: ".pageSize",
			sortBy: ".sortBy",
			order: ".order",
			text: "#search-form input[name=text]",
			form: "#search-form",
			filter: "#search-filter",
			cityFilter: "input[name=city-filter]",
			countryFilter:"input[name=country-filter]",
			btnSubmit : "#search-form .result-search-btn"
		},
		params: {
			pageSize: 9,
			page: 1,
			order: "asc",
			sortBy: "name",
			text: "",
			categoriesFilter: ""
		}		
	},
	_isFliter = true;
	_FILTER_DEFAULTS = {
		categoriesFilter: "",
		countriesFilter:""
	},
	_settings = {},
	_filterSettings = {};
	
	var _bindEvents = function(){
		$(_settings.controls.pageSize).change(_onPageSizeChange);
		$(_settings.controls.sortBy).change(_onSortByChange);
		$(_settings.controls.order).click(_onOrderChange);
		$(_settings.controls.form).submit(_onSearchFormSubmit);
		$(_settings.controls.filter).click(_onSearchFilter);
		$(_settings.controls.btnSubmit).click(_onButtonSubmitClick);
		$(_settings.controls.text).keypress(_onInputEnter);
	},
	_onInputEnter = function(event){
		if(event.keyCode === 13){
			_isFliter = false;
		}
	},
	_onButtonSubmitClick = function(){
		_isFliter = false;
	},
	_onSearchFilter = function(){
		var $form = $(_settings.controls.form);
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
		if(_isFliter== true){
			$form.find("input[name=cities]").val(_getCities());
			$form.find("input[name=countries]").val(_getCountries());
		}else{
			$form.find("input[name=cities]").val('');
			$form.find("input[name=countries]").val('');
		}
		return true;
	},	
	_submitSearchForm = function(){
		$(_settings.controls.form).submit();
	},
	_getCities = function(){
		var values = "";
		$(_settings.controls.cityFilter+":checked").each(function(){
			if(values != ""){
				values += ",";
			}
			values += this.value;
		});
		return values;
	},
	_getCountries = function(){
		var values = "";
		$(_settings.controls.countryFilter+":checked").each(function(){
			if(values != ""){
				values += ",";
			}
			values += this.value;
		});
		return values;
	},
	
	_renderFilters = function(){
		var selectedCategories = _filterSettings.categoriesFilter.split(",");
		for(var i=0; i<selectedCategories.length; i++){
			$('li.level0.parent.city').find("input[value='"+selectedCategories[i]+"']").attr("checked","checked");
		}
	},
	_renderCountryFilter = function(){
		var selectedCountries = _filterSettings.countriesFilter.split(",");
		for(var i=0; i<selectedCountries.length; i++){
			$('li.level0.parent.country').find("input[value='"+selectedCountries[i]+"']").attr("checked","checked");
		}
	}
	;
	
	$.store = function(){};	
	
	$.store.search = function(options){
		_settings = $.extend({}, _DEFAULTS, options);
		_bindEvents();
	};
	
	$.store.filter = function(options){
		_filterSettings = $.extend({}, _FILTER_DEFAULTS, options);
		_renderFilters();
		_renderCountryFilter();
	}
})(jQuery);