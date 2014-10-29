Class('Loader').inherits(Widget)({
	ELEMENT_CLASS  : 'loader',
    HTML           : 	'<div class="overlay">\
    						<div class="modal">\
    							<div class="spinner"></div>\
    						</div>\
    					</div>',
	prototype : {
		init : function(config) {
			Widget.prototype.init.call(this, config);
		},

		// _activate : function() {
			
		// },

		// _deactivate : function() {
		// 	this.element.hide();
		// }

	}
});