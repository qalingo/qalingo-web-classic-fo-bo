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
    
    plugins.FormFocus = {

        targets : null,
        steps : null,

        init : function() {
			if($('.trigger-form-handle-focus').length > 0){
				plugins.FormFocus.targets = $('.trigger-form-handle-focus').find('input, button'),
				plugins.FormFocus.steps = plugins.FormFocus.targets.map(function() {
					return $(this).attr('tabindex');
				}).get();

				$(':input').keyup(function(e) {
					plugins.FormFocus.checkMaxlength($(this), e);
				});
			}
        },

        checkMaxlength : function(_this, e) {
            var maxChar = _this.attr('maxlength');
            var nbrChar = _this.val().length;

            if(nbrChar >= maxChar && e.keyCode != 8)
            {
                _this.val( _this.val().substr(0,maxChar) );
                e.preventDefault();
                plugins.FormFocus.changeFocus(_this);
            }
        },

        changeFocus : function(_this) {
            var current = $.inArray(_this.attr('tabindex'), plugins.FormFocus.steps),
            next = plugins.FormFocus.steps[++current % plugins.FormFocus.steps.length];
            plugins.FormFocus.targets.filter('[tabindex="' + next + '"]').focus();
        }
    };
    
})( window.plugins = window.plugins || {} );
