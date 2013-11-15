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