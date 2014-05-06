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
	var _deleteAllMarket = function(){
	    var currentMarkers = _markers.markers;
	    for(var i=0 ; i < currentMarkers.length; i++){
	        currentMarkers[i].destroy();
	    }
	    _markers.markers = new Array();
	},
	//_setMarker = function(lon,lat,code,name,address,city,country){
	_setMarker = function(store){
	    var size = new OpenLayers.Size(21,25);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon(_iconUrl,size,offset);
        var lon = store.longitude;
        var lat = store.latitude;
        var code = store.code;
	    marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon, lat).transform(_fromProjection, _toProjection),icon);
	    eventMarkerOver = function(evt){
	        var popup = _findPopupByCode(code);
	        if(popup == null){
//	        	var data = {
//	        		code: code,
//	        		name: name,
//	        		address: address, 
//	        		city: city,
//	        		country: country,
//	        		iconImage: iconImage
//	        	};
	        	_initTemplate("marketTemplate", "marketImpl");
	        	var htmlContent = $.render.marketImpl(store);
	            popup = new OpenLayers.Popup.FramedCloud(code,
	            new OpenLayers.LonLat(lon, lat).transform(_fromProjection, _toProjection),
	            new OpenLayers.Size(200,200),
	            htmlContent,
	            null,true);
	            _map.addPopup(popup);
	        }else{
	            popup.show();
	        }
	    }
	    marker.events.register("click", marker, eventMarkerOver);
	    marker.id = "marker"+ code ;
	    _markers.addMarker(marker);
	},	
	_findPopupByCode = function(code){
	    var popups = _map.popups;
	    if(popups == null)
	    {
	        return null;
	    }
	    for(var i = 0 ; i < popups.length ; i++){
	        if(popups[i].id == code ){
	            return popups[i];
	        }
	    }
	    return null;
	},
	_findMarkerById = function(id){
		var currentMarkers = _markers.markers;
	    for(var i=0 ; i < currentMarkers.length; i++){
	        if(currentMarkers[i].id == id){
	        	return currentMarkers[i];
	        }
	    }
	},
	_buildSelectCountry = function(dataJson){
	    var data = dataJson;
	    _initTemplate("selectCountryTemplate", "countryImpl");
    	var htmlContent = $.render.countryImpl({data:data});
	    $('#country').html(htmlContent);
	},
	_buildSelectCityAndSetMarker = function( dataJson, indexCountry ){
	    var country = dataJson[indexCountry] ;
	    var cities = country.cities ;
//	    var html ="<option value =''>All</option>";
	    if(null != cities && typeof cities != 'undefined' ){
		    for(var i = 0; i < cities.length ; i++){
	//	        html += "<option value ='"+ i +"'>"+ cities[i].name +"</option>";
		        var stores = cities[i].stores;
		        _buildSetMarkerByCoordinates(stores);
		    }
	    }
	    _initTemplate("selectCityTemplate", "cityImpl");
    	var htmlContent = $.render.cityImpl({data:cities});
	    $('#city').html(htmlContent);
	    
	},
	_buildSetMarkerByCoordinates = function(stores){
	    for(var i = 0 ; i < stores.length ; i++){ 
	         _setMarker(stores[i]);
	         _buildStoreFound(stores[i]);
	    }
	},
	_buildSetAllMarker = function(dataJson){
	    for(var i = 0; i < dataJson.length; i++){
	        var country = dataJson[i] ;
	        var cities = country.cities ;
	        if(null != cities && typeof cities != 'undefined'){
		        for(var j = 0; j < cities.length ; j++){
		            var coordinates = cities[j].stores;
		            _buildSetMarkerByCoordinates(coordinates);
		        }
	        }
	    }
	    _buildSliderStore();
	    _setCenter();
	    _map.zoomToMaxExtent();
	},
	_buildSetAllMarkerByCountry = function(indexCountry){
	    var country = _dataOSM[indexCountry] ;
	    var cities = country.cities ;
	    if(null != cities && typeof cities != 'undefined'){
	        for(var j = 0; j < cities.length ; j++){
	            var stores = cities[j].stores;
	            _buildSetMarkerByCoordinates(stores);
	        }
	    }
	},
	_buildStoreFound = function(store){
		_storesFound.push(store);
	},
	_buildSliderStore = function(){
		_initTemplate("storesTemplate", "storesImpl");
    	var htmlContent = $.render.storesImpl({data:_storesFound});
    	$('#location-store-list').html(htmlContent);
		$('#location-store-list').slides({
				preload: true,
				generateNextPrev: true,
				play: 0,
				hoverPause: true
			});
			_storesFound = [];
	    },
	_setCenter = function(){
         var currentMarkers = _markers.markers;
          var newBound = new OpenLayers.Bounds();
        for(var i=0 ; i < currentMarkers.length; i++){
            var tempMarker = currentMarkers[i];
            newBound.extend(tempMarker.lonlat);
        }
        var centerPosition = newBound.getCenterLonLat();
         var zoomLv = _map.getZoomForExtent(newBound,true);
        _map.setCenter(centerPosition, zoomLv -1 );
    },
    _setCenterByPosition = function(lat, lon){
    	var positionCenter = new OpenLayers.LonLat(lon, lat).transform(_fromProjection, _toProjection);
    	_map.setCenter(positionCenter, 18);
    },
    _searchAll = function(dataSearch,textSearch){
    	var positionFound = [];
    	for(var i = 0 ; i < dataSearch.length ; i++){
             var cities = dataSearch[i].cities;
             if(null != cities && typeof cities != 'undefined'){
	             for(var j = 0 ; j< cities.length; j++){
	                 var stores = cities[j].stores;
	                 for(var k = 0; k< stores.length; k++){
	                     if(stores[k].name.search(new RegExp(textSearch,"i") ) !== -1){
	                     positionFound.push(stores[k]);
	                     }
	                 }
	             }
             }     
    	}
    	return positionFound;
	},
	_searchByCountry = function(dataSearch, indexCountry, textSearch){
		 var positionFound = [];
		 var cities = dataSearch[indexCountry].cities;
		 if(null != cities && typeof cities != 'undefined'){
		     for(var j = 0 ; j< cities.length; j++){
		         var stores = cities[j].stores;
		         for(var k = 0; k< stores.length; k++){
		             if(stores[k].name.search(new RegExp(textSearch,"i") ) !== -1){
		                 positionFound.push(stores[k]);
		             }
		         }
		     }
		 }
	     return positionFound;
	},
	_searchByCity = function(dataSearch, indexCountry, indexCity,textSearch){
		 var positionFound = [];
		 var cities = dataSearch[indexCountry].cities;
	     var stores = cities[indexCity].stores;
	     for(var k = 0; k< stores.length; k++){
	         if(stores[k].name.search(new RegExp(textSearch,"i") ) !== -1){
	             positionFound.push(stores[k]);
	         }
	     }
	     return positionFound;
	},
	_hideAllPopup = function(){
    	var popups = _map.popups;
        if(popups == null)
        {
            return null;
        }
        for(var i = 0 ; i < popups.length ; i++){
               popups[i].hide();
        }
    },
	_DEFAULTS = {
		map: {
			zoom: 3,
			lonCenter: -30.000,
			latCenter: 45.000
		},
		data: [],
		iconUrl: "http://www.openlayers.org/dev/img/marker.png"
	},
	_dataOSM 		= [],
	_map 			= {},
	_fromProjection = {} ,
	_toProjection	= {},
	_markers		= {},
	_iconUrl		= "",
	_storesFound 	= [],
	_initTemplate = function(templateId, templateName){
		templateId = "#" + templateId;
		$.templates(templateName, templateId);
	};
	
	$.qalingo = function(){};
	
	$.qalingo.storeLocator = function(options){
		var settings ={};
		$.extend(settings, _DEFAULTS, options);
	    var zoom                 = settings.map.zoom;
	    var lonCenter            = settings.map.lonCenter;
	    var latCenter            = settings.map.latCenter;
	    _fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
	    _toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
	    _dataOSM = settings.data;
	    _iconUrl = settings.iconUrl;
	    _map = new OpenLayers.Map("map-store");
	    var mapnik = new OpenLayers.Layer.OSM();
	    _map.addLayer(mapnik);
	    _markers = new OpenLayers.Layer.Markers("Markers");
	    _map.addLayer(_markers);
	    _map.addControl(new OpenLayers.Control.LayerSwitcher());
	    controls = _map.getControlsByClass('OpenLayers.Control.Navigation');
	    for(var i = 0; i < controls.length; ++i)
	    {
	         controls[i].disableZoomWheel();
	    }
	    
	    $('a.store-item').live('click',function(){
	    	var lon   = $(this).data("lon");
	    	var lat   = $(this).data("lat");
	    	var code  = $(this).data("code");
	    	var marker = _findMarkerById("marker"+code);
	    	_setCenterByPosition(lat, lon);
	    	marker.icon.imageDiv.click();
	    });
	    $('#bt-search').click(function(){
	        var textSearch = $('input#search').val();
	        var positionFound = [];
	        var indexCountry = $('#country').find(":selected").attr("value");
	        var optionCity = $('#city').find(":selected");
	        if(indexCountry == ''){
	        	positionFound = _searchAll(_dataOSM,textSearch);
	        }else{
	        	if(optionCity.length > 0){
	        		indexCity = optionCity.attr("value");
	        		if(indexCity == ''){
	        			positionFound = _searchByCountry(_dataOSM ,indexCountry,textSearch );
	        		}else{
	        			positionFound = _searchByCity(_dataOSM, indexCountry, indexCity,textSearch);
	        		}
	        	}else{
	        		positionFound = _searchByCountry(_dataOSM ,indexCountry,textSearch );
	        	}
	        }
	        if(positionFound.length > 0){
	            _deleteAllMarket();
	            _buildSetMarkerByCoordinates(positionFound);
	            _storesFound = positionFound;
	            _buildSliderStore();
	            _setCenter();
	            _hideAllPopup();
	        }
	    });
	    $('#country').change(function(){
	        var option = $(this).find(":selected");
	        var index = option.attr("value");
	        if(index == ''){
	             _buildSetAllMarker(_dataOSM);
	             $('#city').html('<option value="" selected="selected">City/Province</option>');
	        }else{
	            _deleteAllMarket();
	            _buildSelectCityAndSetMarker(_dataOSM,index);
	            _buildSliderStore();
	        }
	        $('input#search').val();
	        _setCenter();
	        _hideAllPopup();
	    });
	    $('#city').change(function(){
	        var indexCountry = $('#country').find(":selected").attr("value");
	        var indexCity = $(this).find(":selected").attr("value");
	        if(indexCity==''){
	            _deleteAllMarket();
	            _buildSetAllMarkerByCountry(indexCountry);
	        }else{
	            var stores =_dataOSM[indexCountry].cities[indexCity].stores;
	            _deleteAllMarket();
	            _buildSetMarkerByCoordinates(stores);
	        }
	        $('input#search').val();
	        _buildSliderStore();
	        _setCenter();
	        _hideAllPopup();
	    });
	    _buildSelectCountry(_dataOSM);
	    _buildSetAllMarker(_dataOSM);
	    _setCenter();
	};
})(jQuery);