Class('Tooltip')({
	prototype: {
		init: function (element, options) {
			var that = this;

			this.options = {
				customClass: ''
			};
			$.extend(this.options, options);

			this.element = typeof element == "string" ? $(element) : element;
			this.tooltip = this.element.find('.tooltip');
			this.userWindow = $(window);
			this._get_tooltip_name();
			this._hoverTooltip();
			this._moderatorClick();
			this._hide_extra_data();

			if (this.options.customClass) this.tooltip.addClass(this.options.customClass);
		},

		_get_tooltip_name: function(){
			this.tooltip_name = '';

			if (this.element.find('a.media-type').attr('title') !== undefined ){
				this.tooltip_name = this.element.find('a.media-type').attr('title').toLowerCase();
			}
		},

		_hoverTooltip: function () {
			var that = this;

			this.element.hover(function (e) {
				if(that.windowIsWide() && !isDevice){
					if ( $(this).is('.selected') ) {
						that.tooltip.hide();
					} else if ( $(this).is('.addVoice') ) {
						$(this).find('.tooltip').show();
					}
					that.show();
				}
			}, function () {
				if(that.windowIsWide()){
					that.detectContent();
				}
			});

			// feature enabled only for screen width < 461 and tags button
			this.element.click(function(ev){
				if(!that.windowIsWide() && ev.target.className === 'tags-container' || ev.target.className === 'tag-tooltip-trigger'){
					if (!that.tooltip.is(':visible')){
						that.show();
						that.element.trigger('tags.show');
						that._addCancelButton();
					} else {
						that.detectContent();
					}
				}
			});

			this.element.bind('tag.apply', function(){
				that.detectContent();
			});

			this.tooltip.children().children('.media-type-info').mouseleave(function () {
				if(that.windowIsWide()){
					that.detectContent();
				}
			});
			this.tooltip.children().children('form').mouseleave(function () {
				if(that.windowIsWide()){
					that.detectContent();
				}
			});
		},
		_addCancelButton: function(){
			var that = this,
				buttonContainer = this.tooltip.find('.mode-button'),
				applyButton = buttonContainer.find('.button');
				cancelButton = applyButton.clone();

				cancelButton.appendTo(buttonContainer).addClass('dismiss-tooltip')
					.find('a')
					.text('Cancel')
					.removeAttr('href')
				.end()
					.bind('click', function(){
						that.detectContent();
					});
		},
		windowIsWide: function(){
			return this.userWindow.width() >= 461;
		},

		_hide_extra_data: function() {
			switch(this.tooltip_name) {
				case 'image':
					this.element.find('.with-image').hide();
					this.element.find('.without-image').show();
					break;
				case 'link':
					this.element.find('.without-link').show();
					this.element.find('.with-link').hide();
					break;
			}
		},

		_show_extra_data: function() {
			if ($('#post_source_url').val() !== ''){
				switch(this.tooltip_name) {
					case 'image':
						this.element.find('.without-image').hide();
						this.element.find('.with-image').show();
						break;
					case 'link':
						this.element.find('.without-link').hide();
						this.element.find('.with-link').show();
						break;
				}
			}
		},

		_moderatorClick: function () {   //functionality for moderate public items view
			var that = this;
			this.element.children().children('a').click(function (){
				if ( $(this).parent().parent().is('.mod') ) {
					that.tooltip.children().children().children('strong').text('');
					that.tooltip.children().children().children('p').html('<span>Thank you! The page is refreshing with unmoderated posts!</span>');
				}
			});
		},

		detectContent: function() {
			if ( $.inArray(this.tooltip_name, ['image','video','link'] ) >= 0 && $('#post_source_url').val() != '' && $('.media > a.active').length == 1 && !$('.tooltip.notice').is(':visible')) {
				this.tooltip.parent().css('z-index', 10);
			} else {
				this.hide();
			}
		},

		show: function() {
			$('a', this.element).addClass('active');

			if (typeof(Post) != 'undefined') {

				if (Post.isVideo($('#post_source_url').val()) && $('a', this.element).hasClass('active') && this.tooltip_name == 'video' ){
					return false;
				}

				if ((Post.isImage($('#post_source_url').val()) || ($('#post_source_url').val() != '')) && $('#post_source_url').val() != '' && $('a', this.element).hasClass('active') && this.tooltip_name == 'image'){
					this._show_extra_data();
				}

				if (Post.isLink($('#post_source_url').val()) && $('#post_source_url').val() != '' && $('a', this.element).hasClass('active') && this.tooltip_name == 'link'){
					this._show_extra_data();
				}
			}
			if (!this.element.is('.selected')) {
				this.tooltip.show();
			}

		},

		hide: function() {
			this.tooltip.hide();
			this.tooltip.find('.dismiss-tooltip').remove();

			if ($('.media > a.active').length == 1 && $.inArray(this.tooltip_name, ['image','video','link'] ) >= 0){
				this._hide_extra_data();
				this.tooltip.parent().css('z-index', '');
			}

			$('a', this.element).removeClass('active');
		}
	}
});
