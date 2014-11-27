Class('VoicesContainer').inherits(Widget)({
    ELEMENT_CLASS  : '',
    HTML           : '\
        <div class="voices-scroller scroll-primary">\
            <div class="voices-container initial-state">\
            </div>\
        </div>\
    ',
    prototype     : {
        fuse            : null,
        delayedEvent    : null,
        perPage         : 60,
        preloadedVoices : [],
        voicesToRender  : [],
        lastVoiceIndex  : 0,
        currentPage     : 0,
        init : function(config) {
            Widget.prototype.init.call(this, config);
            var voicesContainer = this;

            voicesContainer.element.isotope({
                transitionDuration: 0,
                animationEngine: $.browser.mozilla || $.browser.msie ? 'jquery' : 'best-available',
                 animationOptions: {
                    duration: 0,
                    easing: 'linear',
                    queue: false
                },
                resizable: false,
                itemSelector: '.voice-box',
                filter : function() {
                  return !$(this).hasClass('disabled');
                },
                masonry: {
                    columnWidth: 200 - 5
                }
            });

            var complete = function( isoInstance, laidOutItems ) {
              $('.updating-wrapper').hide();
              $('body').css('overflow', 'hidden');
              $('.voice-wrapper').removeClass('initial-state');
              DynamicMeasures.update();
              voicesContainer.element.isotope( 'off', 'layoutComplete', complete);
            }

            voicesContainer.element.isotope( 'on', 'layoutComplete', complete);
            
            window.isotopeReady = true;

            this.delayedEvent = new DelayedEventEmitter();

            this.delayedEvent.bind('isotope-relayout', function(){
                voicesContainer.element.isotope('layout');
            });

            this.element.parent().bind('scroll', function(){
                clearTimeout( $.data( this, "scrollCheck" ) );
                
                $.data( this, "scrollCheck", setTimeout(function() {
                    _.each(voicesContainer.children, function(voice) {
                        if (voice.active) {
                            if (voice.element.visible(true)) {
                                voice.element.removeClass('no-events');
                                voice.setImage();
                            } else {
                                voice.element.addClass('no-events');
                            }
                        }
                    });
                }, 200) );
            })

            this.element.timeago('refresh');
        },

        goToDate : function(date) {
            // CV.timeline.afterFetchActions();
            // return;
            var voicesContainer = this;

            var gotDate         = false,
                dateIsEnabled   = false,
                voiceIndex      = 0,
                foundVoice      = null;

            var date = date.match(/[\d]{4}-[\d]{2}/);

            for (var i = 0; i < voicesContainer.children.length; i++) {
                var child = voicesContainer.children[i];
                var voiceDate = child.createdAt.match(/[\d]{4}-[\d]{2}/);

                voiceIndex      = i;

                if (date[0] == voiceDate[0]) {
                    
                    foundVoice = child;
                    gotDate = true;
                    break;

                }
            };

            _.defer(function(){
                if (!child.active) {
                    var page = Math.ceil((voiceIndex) / voicesContainer.perPage);

                    var voices = voicesContainer.children.slice(0, voiceIndex + 1);

                    var fragment = document.createDocumentFragment();

                    // Sample
                    voices = _.filter(voices, function(voice) {
                        if (voice.active === false) {
                            return true;
                        }
                    });

                    var elements = [];

                    _.each(voices, function(voice) {
                        voice.element.detach();
                        voice.activate();
                        fragment.appendChild(voice.element[0]);
                        elements.push(voice.element[0]);
                    });

                    // Get the last voice index in children
                    var index = voicesContainer.children.indexOf(voices[voices.length - 1]);

                    var beforeIndex = index + 1;

                    voicesContainer.element[0].insertBefore(fragment, voicesContainer.children[beforeIndex].element[0]);

                    voicesContainer.element.isotope('appended', elements);

                    voicesContainer.currentPage = page;
                } 
                
                voicesContainer.element.parent().animate({ scrollTop: foundVoice.element.position().top }, 1000, function() {
                    CV.timeline.afterFetchActions();
                    CV.timeline.updateSliderPosition();
                });
            });
            
            
        },

        createVoiceWidgets : function(callback) {
            var voicesContainer = this;
            var fragment = document.createDocumentFragment();

            
            _.each(this.preloadedVoices, function(post) {
                if (post.post) {
                    post = post.post;
                }

                voice = new VoiceElement({
                    name          : 'post_' + post.id,
                    id            : post.id,
                    image         : post.image,
                    approved      : post.approved,
                    description   : CV.getExcerpt(post.description, 250),
                    imageWidth    : post.image_width,
                    imageHeight   : post.image_height,
                    negativeVotes : post.negative_votes_count,
                    positiveVotes : post.positive_votes_count,
                    overallScore  : post.overall_score,
                    sourceService : post.source_service,
                    sourceType    : post.source_type,
                    sourceURL     : post.source_url,
                    title         : post.title,
                    voiceID       : post.voice_id,
                    timeAgo       : post.created_at,
                    createdAt     : post.created_at,
                    service       : post.source_url,
                    disabled      : true,
                    active        : false
                });

                voicesContainer.appendChild(voice);

                fragment.appendChild(voice.element[0]);
            });

            voicesContainer.element[0].appendChild(fragment);    
            
            CV.timeline.options.votes.unbindEvents().bindEvents();
            
            if (callback) {
                callback();
            }

            this.voicesToRender = [];
        },

        enableNextPage : function(callback) {
            var voicesContainer = this;
            var fragment = document.createDocumentFragment();
            var elements = [];

            this.lastVoiceIndex = this.perPage * this.currentPage;

            if (this.lastVoiceIndex > this.children.length) {
                this.lastVoiceIndex = this.children.length;
            }

            var voices = this.children.slice(this.lastVoiceIndex, (this.perPage * (this.currentPage + 1)));

            _.each(voices, function(voice) {
                elements.push(voice.element[0]);
                voice.element.detach();
                voice.activate();
                voice.setImage();
                fragment.appendChild(voice.element[0]);
            });

            if (this.lastVoiceIndex === 0) {
                voicesContainer.element[0].appendChild(fragment);
            } else {
                voicesContainer.element[0].insertBefore(fragment, voicesContainer.children[this.lastVoiceIndex - 1].element[0]);
            }
            
            this.element.isotope('appended', elements);

            this.element.timeago('refresh');

            this.currentPage++;
            
            if (callback) {
                callback();
            }
        }
    }
});
