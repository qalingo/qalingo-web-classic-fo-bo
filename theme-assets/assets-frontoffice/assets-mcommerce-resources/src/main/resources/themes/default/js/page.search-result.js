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
			priceRange: "#price-slider",
			filter: "#search-filter",
			categoriesFilter: "input[name=catalog-categories]",
			btnSubmit : "#search-form .result-search-btn"
		},
		params: {
			pageSize: 9,
			page: 1,
			order: "asc",
			sortBy: "name",
			text: "",
			price: {
				start : 0,
				end   : 500,
				min   : 0,
				max   : 500
			},
			categoriesFilter: ""
		}		
	},
	_isFliter = true,
	_FILTER_DEFAULTS = {
		categoriesFilter: "",
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
			$form.find("input[name=categoriesFilter]").val(_getCatalogCategories());
		}else{
			$form.find("input[name=categoriesFilter]").val('');
			$form.find('#priceStartParam').val( _settings.params.price.min );
	        $form.find('#priceEndParam').val( _settings.params.price.max );
		}
		return true;
	},	
	_submitSearchForm = function(){
		$(_settings.controls.form).submit();
	},
	_getCatalogCategories = function(){
		var values = "";
		$(_settings.controls.categoriesFilter+":checked").each(function(){
			if(values != ""){
				values += ",";
			}
			values += this.value;
		});
		return values;
	},
	_startSliderRange = function(){
		$.templates("captionImp","#caption");
		$('.x-ui-slider.x-ui-slider-horizontal').slider({
		      range: true,
		      min: _settings.params.price.min,
		      max: _settings.params.price.max,
		      values: [ _settings.params.price.start, _settings.params.price.end ],
		      slide: function( event, ui ) {
		    	var $form = $(_settings.controls.form);
		    	var html = $.render.captionImp({"priceStart":ui.values[ 0 ],"endStart":ui.values[ 1 ]});
				$('.search-price-caption').html(html);
		        $form.find('#priceStartParam').val( ui.values[ 0 ] );
		        $form.find('#priceEndParam').val( ui.values[ 1 ] );
		      }
		});		
	},
	_renderFilters = function(){
		var selectedCategories = _filterSettings.categoriesFilter.split(",");
		for(var i=0; i<selectedCategories.length; i++){
			$(_filterSettings.controls.catagoriesFilter + selectedCategories[i]).attr("checked","checked");
		}
	};
	
	$.qalingo = function(){};	
	
	$.qalingo.search = function(options){
		_settings = $.extend({}, _DEFAULTS, options);
		_bindEvents();
		_startSliderRange();
	};
	
	$.qalingo.filter = function(options){
		_filterSettings = $.extend({}, _FILTER_DEFAULTS, options);
		_renderFilters();
	}
})(jQuery);