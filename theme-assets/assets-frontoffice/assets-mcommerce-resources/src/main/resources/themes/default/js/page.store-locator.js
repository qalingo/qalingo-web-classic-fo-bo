$(function($){
	var _deleteAllMarket = function(){
	    var currentMarkers = markers.markers;
	    for(var i=0 ; i < currentMarkers.length; i++){
	        currentMarkers[i].destroy();
	    }
	    markers.markers = new Array();
	},
	_setMarket = function(lon,lat,code,businessName,address,city,country){
	    marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection));
	    eventMarkerOver = function(evt){
	        var popup = _findPopupByCode(code);
	        if(popup == null){
	        	var data = {
	        		code: code,
	        		businessName: businessName,
	        		address: address, 
	        		city: city,
	        		country: country
	        	};
	        	_initTemplate("marketTemplate", "marketImpl");
	        	var htmlContent = $.render.marketImpl(data);
	        	
//	        	var htmlContent = "";
//	        	htmlContent +='<div id="store-info-'+code+'" class="location-popup" style="display: block;">';
//	        	htmlContent += '<span class="location-popup-thumb">';
//	        	htmlContent += '<img src="'+"/fo-mcommerce-resources/default/img/home/slider-1.jpg"+'"></span>';
//	        	htmlContent += '<span class="location-popup-info">';
//	        	htmlContent += '<h2 class="store-list-title">'+ businessName + '</h2>';
//	        	htmlContent += '<p>'+ address +'<br>'+ city +'<br>'+country+'<br></p></span></div>';
	            popup = new OpenLayers.Popup.FramedCloud(code,
	            new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection),
	            new OpenLayers.Size(200,200),
	            htmlContent,
	            null,true);
	            map.addPopup(popup);
	        }else{
	            popup.show();
	        }
	    }
	    eventMarkerOut = function(evt){
	        var popup = _findPopupByCode(code);
	        popup.hide();
	    }
	    marker.events.register("mouseover", marker, eventMarkerOver);
	    marker.events.register("mouseout", marker, eventMarkerOut);
	    markers.addMarker(marker);   
	},	
	_findPopupByCode = function(code){
	    var popups = map.popups;
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
	_buildSelectCountry = function(dataJson){
	    var data = dataJson;
	    var html = "<option value =''>All</option>";
	    for(var i = 0; i < data.length ; i++){
	     html += "<option value ='"+ i +"'>"+ data[i].code +"</option>";
	    }
	    $('#country').html(html);
	},
	_buildSelectCityAndSetMarker = function( dataJson, indexCountry ){
	    var country = dataJson[indexCountry] ;
	    var cities = country.cities ;
	    var html ="<option value =''>All</option>";
	    for(var i = 0; i < cities.length ; i++){
	        html += "<option value ='"+ i +"'>"+ cities[i].name +"</option>";
	        var stores = cities[i].stores;
	        _buildSetMarkerByCoordinates(stores);
	    }   
	    $('#city').html(html);
	},
	_buildSetMarkerByCoordinates = function(stores){
	    for(var i = 0 ; i < stores.length ; i++){
	         var lon = stores[i].longitude;
	         var lat = stores[i].latitude;
	         var code = stores[i].code;
	         var businessName = stores[i].businessName;
	         var address = stores[i].address1;
	         var city = stores[i].city;
	         var country = stores[i].country;
	         _setMarket(lon,lat,code,businessName,address,city,country);
	         _buildStoreFound(stores[i]);
	    }
	},
	_buildSetAllMarker = function(dataJson){
	    for(var i = 0; i < dataJson.length; i++){
	        var country = dataJson[i] ;
	        var cities = country.cities ;
	        for(var j = 0; j < cities.length ; j++){
	            var coordinates = cities[j].stores;
	            _buildSetMarkerByCoordinates(coordinates);
	        }   
	    }
	    _buildSliderStore();
	    map.setCenter(positionCenter, zoom);
	    map.zoomToMaxExtent();
	},
	_buildSetAllMarkerByCountry = function(indexCountry){
	        var country = dataOSM[indexCountry] ;
	        var cities = country.cities ;
	        for(var j = 0; j < cities.length ; j++){
	            var stores = cities[j].stores;
	            _buildSetMarkerByCoordinates(stores);
	        }
	},
	_buildStoreFound = function(store){
		storesFound.push(store);
	},
	_buildSliderStore = function(){
		var html = '';
		var j = 0 ;
		for(var i = 0; i<storesFound.length; i++){
			if(j == 0){
			html += '<div class="slide">';
			}
			html += '<div class="item span3"><a data-lon="'+storesFound[i].longitude+'" data-lat="'+storesFound[i].latitude +'" href="javascript:void(0)" class="store-item"><span class="store-thumb"><img src="/fo-mcommerce-resources/default/img/home/slider-1.jpg" alt="Store1"></span>';
		    html += '<div class="store-item-info"><h2 class="store-list-title">'+ storesFound[i].businessName +'</h2>';
			html += '<span class="store-list-address"><i class="icon-map-marker"></i>'+ storesFound[i].address1 +'</span></div>';
			html += '</a></div>';
			j++;
			if(j == 4){
				html += "</div>";
				j = 0;
			}
		}
		if( j!=0 ){
			html += "</div>";
		}
		$('.slides_container.row.products-grid').html(html);
		$('#location-store-list').slides({
				preload: true,
				generateNextPrev: true,
				play: 0,
				hoverPause: true
			});
			storesFound = [];
	    },
	_setCenter = function(){
         var currentMarkers = markers.markers;
          var newBound = new OpenLayers.Bounds();
        for(var i=0 ; i < currentMarkers.length; i++){
            var tempMarker = currentMarkers[i];
            newBound.extend(tempMarker.lonlat);
        }
        var centerPosition = newBound.getCenterLonLat();
         var zoomLv = map.getZoomForExtent(newBound,true);
        map.setCenter(centerPosition, zoomLv -1 );
    },
    _setCenterByPosition = function(lat, lon){
    	var positionCenter = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    	map.setCenter(positionCenter, 18);
    },
    _searchAll = function(dataSearch,textSearch){
    	var positionFound = [];
    	 for(var i = 0 ; i < dataSearch.length ; i++){
             var cities = dataSearch[i].cities;
             for(var j = 0 ; j< cities.length; j++){
                 var stores = cities[j].stores;
                 for(var k = 0; k< stores.length; k++){
                     if(stores[k].businessName.search(new RegExp(textSearch,"i") ) !== -1){
                     positionFound.push(stores[k]);
                 }
             }
         }
     }
	 return positionFound;
	},
	_searchByCountry = function(dataSearch, indexCountry, textSearch){
		 var positionFound = [];
		 var cities = dataSearch[indexCountry].cities;
	     for(var j = 0 ; j< cities.length; j++){
	         var stores = cities[j].stores;
	         for(var k = 0; k< stores.length; k++){
	             if(stores[k].businessName.search(new RegExp(textSearch,"i") ) !== -1){
	                 positionFound.push(stores[k]);
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
	         if(stores[k].businessName.search(new RegExp(textSearch,"i") ) !== -1){
	             positionFound.push(stores[k]);
	         }
	     }
	     return positionFound;
	},
	_DEFAULTS = {
		map: {
			zoom: 3,
			lonCenter: -30.000,
			latCenter: 45.000
		},
		data: {}
	},
	_initTemplate = function(templateId, templateName){
		templateId = "#" + templateId;
		$.templates(templateName, templateId);
	};
	
	var $.qalingo = function(){};
	
	var $.qalingo.storeLocator = function(options){
		var settings = $.extend({}, options, _DEFAULTS);
		var storesFound = [];
	    var zoom                 = settings.map.zoom;
	    var lonCenter            = settings.map.lonCenter;
	    var latCenter            = settings.map.latCenter;
	    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform
																		// from
																		// WGS
																		// 1984
	    var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to
																		// Spherical
																		// Mercator
																		// Projection
	    var dataOSM = settings.data;
	    var positionCenter = new OpenLayers.LonLat(lonCenter, latCenter).transform(fromProjection, toProjection);
	    map = new OpenLayers.Map("map-store");
	    var mapnik = new OpenLayers.Layer.OSM();
	    map.addLayer(mapnik);
	    var markers = new OpenLayers.Layer.Markers("Markers");
	    map.addLayer(markers);
	    map.addControl(new OpenLayers.Control.LayerSwitcher());
	    controls = map.getControlsByClass('OpenLayers.Control.Navigation');
	    for(var i = 0; i < controls.length; ++i)
	    {
	         controls[i].disableZoomWheel();
	    }
	    
	    $('a.store-item').live('click',function(){
	    	var lon = $(this).data("lon");
	    	var lat = $(this).data("lat");
	    	_setCenterByPosition(lat, lon);
	    });
	    $('#bt-search').click(function(){
	        var textSearch = $('input#search').val();
	        var positionFound = [];
	        var indexCountry = $('#country').find(":selected").attr("value");
	        var optionCity = $('#city').find(":selected");
	        if(indexCountry == ''){
	        	positionFound = _searchAll(dataOSM,textSearch);
	        }else{
	        	if(optionCity.length > 0){
	        		indexCity = optionCity.attr("value");
	        		if(indexCity == ''){
	        			positionFound = _searchByCountry(dataOSM ,indexCountry,textSearch );
	        		}else{
	        			positionFound = _searchByCity(dataOSM, indexCountry, indexCity,textSearch);
	        		}
	        	}else{
	        		positionFound = _searchByCountry(dataOSM ,indexCountry,textSearch );
	        	}
	        }
	        if(positionFound.length > 0){
	            _deleteAllMarket();
	            _buildSetMarkerByCoordinates(positionFound);
	            storesFound = positionFound;
	            _buildSliderStore();
	            _setCenter();
	        }
	    });
	    $('#country').change(function(){
	        var option = $(this).find(":selected");
	        var index = option.attr("value");
	        if(index == ''){
	             _buildSetAllMarker(dataOSM);
	             $('#city').html('<option value="" selected="selected">City/Province</option>');
	        }else{
	            _deleteAllMarket();
	            _buildSelectCityAndSetMarker(dataOSM,index);
	            _buildSliderStore();
	        }
	        _setCenter();
	    });
	    $('#city').change(function(){
	        var indexCountry = $('#country').find(":selected").attr("value");
	        var indexCity = $(this).find(":selected").attr("value");
	        if(indexCity==''){
	            _deleteAllMarket();
	            _buildSetAllMarkerByCountry(indexCountry);
	        }else{
	            var stores =dataOSM[indexCountry].cities[indexCity].stores;
	            _deleteAllMarket();
	            _buildSetMarkerByCoordinates(stores);
	        }
	        _buildSliderStore();
	        _setCenter();
	    });
	    _buildSelectCountry(dataOSM);
	    _buildSetAllMarker(dataOSM);
	    _setCenter();
	};
})(jQuery);