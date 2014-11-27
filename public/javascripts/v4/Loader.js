Class('Loader').inherits(Widget)({
    HTML           : 	'<div class="progressjs-progress progressjs-theme" style="position: fixed; left: 0px; top: 0px; width: 1440px;">\
                            <div class="progressjs-inner" style="width: 0%; background-color: ' + CV.theme + ';">\
                                <div class="progressjs-percent">0%</div>\
                            </div>\
                        </div>',
	prototype : {
		init : function(config) {
			Widget.prototype.init.call(this, config);
			var loader = this;

			loader.element.css('width', $(document).width());
			
			$(window).resize(function() {
				loader.element.css('width', $(document).width());
			})
		},
		_activate : function() {
		    Widget.prototype._activate.call(this);
		    this.element.find('.progressjs-inner').css('width', '0%');
		    this.element.addClass('shown');
		    this.element.find('.progressjs-inner').css('width', '100%');
		},
		_deactivate : function() {
		    Widget.prototype._deactivate.call(this);
		    var that = this;
		    this.element.removeClass('shown');
		    that.element.find('.progressjs-inner').css('width', '0%');    
		    
		}

	}
});