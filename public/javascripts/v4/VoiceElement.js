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
                <span class="time-ago"></span>\
                <p class="description"></p>\
            </div>\
            <div class="voice-action">\
                <span class="post-icon-type"></span>\
                <ul class="actions">\
                    <li><a class="facebook" target="_blank" /></li>\
                    <li><a class="twitter" target="_blank" /></li>\
                    <li class="flag-div">\
                        <a href="" class="flag vote-post" data-method="post" rel="nofollow" />\
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
                    </li>\
                </ul>\
                <div style="clear:both"></div>\
            </div>\
    ',
    prototype     : {
        id            : 0,
        postURL       : null,
        apporved      : false,
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

        init : function(config) {
            Widget.prototype.init.call(this, config);

            this.setupElements();
        },

        setupElements : function() {
            var voice = this;

            this.element.addClass(this.sourceType);

            if (this.approved) {
                this.element.addClass('unmoderated');
            }

            this.element.attr({
                'data-post-id'    : this.id,
                'data-created-at' : this.createdAt
            });

            if (voice.isAdmin) {
                this.element.find('a.close-voice-box').attr('href', this.postURL);    
            } else {
                this.element.find('a.close-voice-box').hide();
            }
            

            this.element.find('a.source-url').attr({
                'data-type'      : voice.sourceType,
                'data-title'     : voice.title,
                'data-permalink' : voice.url,
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

            this.element.find('.time-ago').html(this.timeAgo);

            if (this.sourceType == 'link' || this.sourceType == 'image') {
                this.element.find('p.description').html(this.description);  
            }

            this.element.find('.post-icon-type').addClass(this.sourceType + '-icon');

            this.element.find('a.facebook').attr({
                'href' : 'http://facebook.com/sharer.php?u=' + voice.postURL
            });

            this.element.find('a.twitter').attr({
                'href' : 'http://twitter.com/intent/tweet?text=' +  encodeURI(voice.title) + '&url=' + encodeURI(voice.postURL) +'&via=crowdvoice'
            });
        }
        
    }
});