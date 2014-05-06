/*
 * Most of the code in the Qalingo project is copyrighted Hoteia and licensed
 * under the Apache License Version 2.0 (release version 0.8.0)
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *                   Copyright (c) Hoteia, 2012-2014
 * http://www.hoteia.com - http://twitter.com/hoteia - contact@hoteia.com
 *
 */
if(typeof stage != 'undefined'){
stage.addEventListener("ScriptReady", 
		[
			{type:"BOOTSTRAP_GLOBAL", handler:"startupGlobal"},
			{type:"BOOTSTRAP_DECORATOR", handler:"startupDecorator"},
			{type:"BOOTSTRAP_PAGE", handler:"startupPage"}
		]
	);
}

if(!(typeof window.startupPage == 'function')) startupPage = function() {}; 
if(!(typeof window.startupDecorator == 'function')) startupDecorator = function() {};
if(!(typeof window.startupGlobal == 'function'))  startupGlobal = function() {};

$(document).ready(function() {
	if(typeof stage != 'undefined'){
		stage.dispatchEvent("ScriptReady", "BOOTSTRAP_GLOBAL");
		stage.dispatchEvent("ScriptReady", "BOOTSTRAP_DECORATOR");
		stage.dispatchEvent("ScriptReady", "BOOTSTRAP_PAGE");
	}
});