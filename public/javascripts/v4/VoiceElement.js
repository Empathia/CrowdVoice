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
                        <div class="tooltip-positioner bottom">\
                            <div class="media-type-info">\
                                <strong class="media-type-title"></strong>\
                                <p class="flag-tooltip">\
                                    <span>Flag Inappropiate Content</span>\
                                </p>\
                            </div>\
                            <p class="tooltip-arrow"><span></span></p>\
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
    PLAY_ICON : '<i class="mediafeed-sprite play-icon"></i>',
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
        contentElement: null,
        disabled      : false,

        init : function(config) {
            Widget.prototype.init.call(this, config);

            var voice = this;

            // Build thumbURL
            var bucket = "http://crowdvoice-production-bucket.s3.amazonaws.com/uploads/";

            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic"];

            var date    = new Date(this.createdAt);
            var year    = date.getUTCFullYear();
            var month   = months[date.getUTCMonth()];
            var day     = (date.getDate() < 10 ? '0' : '') + date.getDate();
            var model   = 'image';
            var version = 'thumb_';

            this.thumbURL = bucket + year + '/' + month + '/' + day + '/post/image/' + this.id + '/' + version + this.image;

            this.sourceElement = this.element.find('a.source-url');
            this.contentElement = this.element.find('.voice-cont');

            this.URL     = this.getURL();
            this.postURL = this.isRawImage() ? this.image.url : this.sourceURL;

            this.setupElements()._bindEvents();

            if ($.deparam.querystring().post && $.deparam.querystring().post === this.id.toString()) {
                window.CV.OverlaysController.showOverlay(this);
            }

            if (!this.approved) {
                this.element.find('.vote-post.thumb').bind('click', function() {
                    $.post(this.href, function(data) {
                        voice.element.find('.voice-unmoderated').remove();
                        voice.element.removeClass('unmoderated');
                    });
                    return false;
                });
            }

        },

        setupElements : function() {
            var voice = this;

            this.element.addClass(this.sourceType);

            if (!this.approved) {
                this.element.addClass('unmoderated');

                this.element.find('.up.flag-div a').attr({
                    'href' : window.location.pathname + '/posts/' + voice.id + '/votes.json?rating=1'
                });

                this.element.find('.down.flag-div a').attr({
                    'href' : window.location.pathname + '/posts/' + voice.id + '/votes.json?rating=-1'
                });
            } else {
                this.element.find('.voice-unmoderated').hide();
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
            } else {
                this.sourceElement.append(this.constructor.PLAY_ICON);
            }

            this.element.find('.post-icon-type').addClass(this.sourceType + '-icon');

            this.element.find('a.facebook').attr({
                'href' : 'http://facebook.com/sharer.php?u=' + voice.URL
            });

            this.element.find('a.twitter').attr({
                'href' : 'http://twitter.com/intent/tweet?text=' +  escape(voice.title) + '&url=' + escape(voice.URL) +'&via=crowdvoice'
            });

            return this;
        },

        _bindEvents : function _bindEvents() {
            this.contentElement.bind('click', function(event) {
                event.preventDefault();
                window.CV.OverlaysController.showOverlay(this);
            }.bind(this));

            return this;
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
        },

        _enable : function() {
            // Widget.prototype._enable.call(this);
            this.disabled = false;

            this.element.removeClass('disabled').css({
                display : 'block'
            });

            this.element[0].style.removeProperty('height');
            this.element[0].style.removeProperty('width');
        },

        _disable : function() {
            // Widget.prototype._disable.call(this);
            this.disabled = true;

            this.element.addClass('disabled').css({
                display : 'none',
                width : 0,
                height : 0
            });
        },

        /**
         * Returns an array of its siblings filtered by the passed sourceTypes.
         * @property getSiblingsBySourceType <public> [Function]
         * @argument sourceTypes <required> [Array]
         * @example voiceElementInstance.getSiblingsBySourceType(['link']);
         * @return this.parent.children | filter [Array]
         */
        getSiblingsBySourceType : function getSiblingsBySourceType(sourceTypes) {
            var childs, currentIndex;

            if (this.parent === 'undefined') {
                return [];
            }

            return this.parent.children.filter(function(child) {
                return sourceTypes.some(function(type) {
                    if (child.sourceType === type) {
                        return child;
                    }
                });
            });
        },

        /**
         * Returns its previous sibling with the same sourceType if found.
         * @property getPreviousSiblingBySourceType <public> [Function]
         * @argument sourceTypes <required> [Array]
         * @example voiceElementInstance.getPreviousSiblingBySourceType(['image', 'video']);
         * @return this.parent.children[ previous ] [VoiceElement | undefined]
         */
        getPreviousSiblingBySourceType : function getPreviousSiblingBySourceType(sourceTypes) {
            var childs, currentIndex;

            if (this.parent === 'undefined') {
                return;
            }

            childs = this.parent.children.filter(function(child) {
                return sourceTypes.some(function(type) {
                    if (child.sourceType === type) {
                        return child;
                    }
                });
            });

            currentIndex = childs.indexOf(this);

            if (currentIndex === 0) {
                return;
            }

            return childs[currentIndex - 1];
        },

        /**
         * Returns its next sibling with the same sourceType if found.
         * @property getNextSiblingBySourceType <public> [Function]
         * @argument sourceTypes <required> [Array]
         * @example voiceElementInstance.getNextSiblingBySourceType(['image']);
         * @return this.parent.children[ next ] [VoiceElement | undefined]
         */
        getNextSiblingBySourceType : function getNextSiblingBySourceType(sourceTypes) {
            var childs, currentIndex;

            if (this.parent === 'undefined') {
                return;
            }

            childs = this.parent.children.filter(function(child) {
                return sourceTypes.some(function(type) {
                    if (child.sourceType === type) {
                        return child;
                    }
                });
            });

            currentIndex = childs.indexOf(this);

            if (currentIndex === (childs.length - 1)) {
                return;
            }

            return childs[currentIndex + 1];
        }
    }
});
