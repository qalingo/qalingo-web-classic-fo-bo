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
			countryFilter:"input[name=country-filter]"
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
	_FILTER_DEFAULTS = {
		categoriesFilter: "",
		countriesFilter:"",
		controls: {
			catagoriesFilter: "#catalog-categories-"
		}
	},
	_settings = {},
	_filterSettings = {};
	
	var _bindEvents = function(){
		$(_settings.controls.pageSize).change(_onPageSizeChange);
		$(_settings.controls.sortBy).change(_onSortByChange);
		$(_settings.controls.order).click(_onOrderChange);
		$(_settings.controls.form).submit(_onSearchFormSubmit);
		$(_settings.controls.filter).click(_onSearchFilter);
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
		$form.find("input[name=cities]").val(_getCities());
		$form.find("input[name=countries]").val(_getCountries());
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