Class('VoiceElement').inherits(Widget)({
    ELEMENT_CLASS  : '',
    HTML           : '\
        <div class="voice-box">\
            <a href="" class="close-voice-box" data-confirm="Are you sure?" data-method="delete" rel="nofollow" />\
            <div class="voice-cont">\
                <a class="source-url" href="">\
                    <img class="thumb-preview" />\
                </a>\
                <h3></h3>\
                <p class="description"></p>\
            </div>\
            <div class="voice-action">\
                <ul class="actions">\
                    <li>\
                        <a class="twitter" target="_blank">\
                            <i class="mediafeed-sprite twitter"></i>\
                        </a>\
                    </li>\
                    <li>\
                        <a class="facebook" target="_blank">\
                            <i class="mediafeed-sprite facebook"></i>\
                        </a>\
                    </li>\
                </ul>\
                <div class="flag-div">\
                    <a href="" class="vote-post mediafeed-sprite flag" data-method="post" rel="nofollow" />\
                    <div class="tooltip flag-tip" data-post-id="">\
                        <div class="tooltip-positioner">\
                            <p class="tooltip-arrow"><span></span></p>\
                            <div class="media-type-info">\
                                <strong class="media-type-title"></strong>\
                                <p class="flag-tooltip">\
                                    <span>Flag Inappropiate Content</span>\
                                </p>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
                <div style="clear:both"></div>\
            </div>\
            <div class="voice-unmoderated">\
              <ul class="clearfix">\
                <li class="up flag-div">\
                    <a class="vote-post thumb" data-method="post" rel="nofollow">\
                        <i class="mediafeed-sprite allow-post"></i>\
                        <span class="text">Allow</span>\
                    </a>\
                </li>\
                <li class="down flag-div">\
                  <a class="vote-post thumb" data-method="post" rel="nofollow">\
                      <i class="mediafeed-sprite deny-post"></i>\
                      <span class="text">Deny</span>\
                  </a>\
                </li>\
              </ul>\
              <div style="clear:both"></div>\
            </div>\
    ',
    VOICE_TYPE_HTML : '\
        <div class="voice-content-type-wrapper">\
            <i class="mediafeed-sprite post-icon-type"></i>\
            <b class="time-ago"></b>\
        </div>\
    ',
    prototype     : {
        id            : 0,
        URL           : null,
        postURL       : null,
        approved      : false,
        description   : null,
        imageWidth    : 0,
        imageHeight   : 0,
        thumbURL      : null,
        negativeVotes : 0,
        positiveVotes : 0,
        overallScore  : 0,
        sourceService : null,
        sourceType    : null,
        sourceURL     : null,
        title         : null,
        voiceID       : 0,
        createdAt     : null,
        timeAgo       : null,
        service       : null,
        sourceElement : null,

        init : function(config) {
            Widget.prototype.init.call(this, config);

            this.sourceElement = this.element.find('a.source-url');

            this.URL     = this.getURL();
            this.postURL = this.isRawImage() ? this.image.url : this.sourceURL;

            this.setupElements();

            if ($.deparam.querystring().post && $.deparam.querystring().post === this.id.toString()) {
                var link = this.sourceElement;
                if ( link.length ) {
                    window.overlays.buildOverlay( link );
                }
            }
        },

        setupElements : function() {
            var voice = this;

            this.element.addClass(this.sourceType);

            if (!this.approved) {
                this.element.addClass('unmoderated');

                this.element.find('.voice-unmoderated');

                this.element.find('.up.flag-div a').attr({
                    'href' : window.location.pathname + '/posts/' + voice.id + '/votes.json?rating=1'
                });

                this.element.find('.down.flag-div a').attr({
                    'href' : window.location.pathname + '/posts/' + voice.id + '/votes.json?rating=-1'
                });
            }

            this.element.attr({
                'data-post-id'    : this.id,
                'data-created-at' : this.createdAt
            });

            if (CV.isAdmin) {
                this.element.find('a.close-voice-box').attr('href', this.postURL);
            } else {
                this.element.find('a.close-voice-box').hide();
            }

            this.sourceElement.attr({
                'data-type'      : voice.sourceType,
                'data-title'     : voice.title,
                'data-permalink' : voice.URL,
                'data-ago'       : voice.timeAgo,
                'data-id'        : voice.id,
                'data-voted'     : false,
                'data-service'   : voice.service,
                'href'           : voice.postURL
            });

            this.element.find('.thumb-preview').attr({
                'src'   : voice.thumbURL,
                'width' : voice.imageWidth,
                'height' : voice.imageHeight
            });

            this.element.find('h3').html(this.title);

            if (this.sourceType == 'link') {
                this.sourceElement.after(this.constructor.VOICE_TYPE_HTML);
            } else {
                this.sourceElement.append(this.constructor.VOICE_TYPE_HTML);
            }

            this.element.find('.time-ago').html(this.timeAgo);

            if (this.sourceType == 'link' || this.sourceType == 'image') {
                this.element.find('p.description').html(this.description);
            }

            this.element.find('.post-icon-type').addClass(this.sourceType + '-icon');

            this.element.find('a.facebook').attr({
                'href' : 'http://facebook.com/sharer.php?u=' + voice.URL
            });

            this.element.find('a.twitter').attr({
                'href' : 'http://twitter.com/intent/tweet?text=' +  escape(voice.title) + '&url=' + escape(voice.URL) +'&via=crowdvoice'
            });
        },

        isRawImage : function() {
            var flickrRegExp  = /^https?:\/\/(?:www\.)?flickr\.com\/photos\/[-\w@]+\/\d+/i;
            var twitpicRegExp = /^https?:\/\/(?:www\.)?twitpic\.com\/[^\/]+$/i;
            var yfrogRegExp   = /^https?:\/\/(?:www\.)?yfrog\.com\/[^\/]+$/i;
            var isRawImage = false;

            if (this.sourceType === 'image') {
                if (this.sourceURL.search(flickrRegExp) == -1) {
                    isRawImage = true;
                }

                if (this.sourceURL.search(twitpicRegExp) == -1) {
                    isRawImage = true;
                }

                if (this.sourceURL.search(yfrogRegExp) == -1) {
                    isRawImage = true;
                }
            }

            return isRawImage;
        },

        getURL : function() {
            var params = $.deparam.querystring();
            var voice  = window.location.origin + window.location.pathname;
            var url = voice + '?post=' + this.id;

            if (params.tags) {
                url = url + '&tags=' + params.tags;
            }

            if (params.all) {
                url = url + '&all=' + params.all;
            }

            return url;
        }
    }
});
