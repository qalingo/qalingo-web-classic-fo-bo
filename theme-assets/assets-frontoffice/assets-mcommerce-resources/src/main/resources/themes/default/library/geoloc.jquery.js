(function ($, window, document, undefined) {
    $.geolocation = function (success_func, fail_func) {
 
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosition, errors);
        } else {
            // browser doesn't supports geolocation so exit now.
            FAIL("NOT_SUPPORTED");
            return;
        }
 
        function getPosition(position) {
            user_lat = position.coords.latitude;
            user_long = position.coords.longitude;
            SUCCESS(user_lat, user_long);
            return;
        }
 
        function errors(error_code) {
            switch (error.code) {
            case error.PERMISSION_DENIED:
                FAIL("PERMISSION_DENIED");
                break;
 
            case error.POSITION_UNAVAILABLE:
                FAIL("POSITION_UNAVAILABLE");
                break;
 
            case error.TIMEOUT:
                FAIL("TIMEOUT");
                break;
 
            case error.UNKNOWN_ERROR:
                FAIL("UNKNOWN_ERROR");
                break;
            }
            return;
        }
 
        function SUCCESS(user_lat, user_long) {
            if (typeof (success_func) != "undefined") {
                success_func(user_lat, user_long);
            } else {
                alert("Latitude = " + user_lat + " and Longitude = " + user_long);
            }
        }
 
        function FAIL(error) {
            if (typeof (fail_func) != "undefined") {
                fail_func(error);
            } else {
                alert(error);
            }
        }
 
    }
})(jQuery, window, document);