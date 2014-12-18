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
        filteredResults : [],
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
                clearTimeout( $.data( this, "scrollChecker" ) );

                $.data( this, "scrollChecker", setTimeout(function() {
                    _.each(voicesContainer.children, function(voice) {
                        if (voice.active) {
                            if (voice.element.visible(true)) {
                                voice.element.removeClass('no-events');
                                
                                if (!voice.thumbElement.hasClass('na')) {
                                    voice.setImage();
                                }
                            } else {
                                voice.element.addClass('no-events');
                            }
                        }
                    });
                }, 200) );
            });
        },

        goToDate : function(date) {
            var voicesContainer = this;

            var gotDate         = false,
                dateIsEnabled   = false,
                voiceIndex      = 0,
                foundVoice      = null;

            var date = date.match(/[\d]{4}-[\d]{2}/);

            for (var i = 0; i < voicesContainer.filteredResults.length; i++) {
                var child = voicesContainer.filteredResults[i];
                var voiceDate = child.createdAt.match(/[\d]{4}-[\d]{2}/);

                voiceIndex      = i;

                if (date[0] === voiceDate[0]) {

                    foundVoice = child;
                    gotDate = true;
                    break;

                }
            };

            _.defer(function(){
                if (!foundVoice) {
                    return;
                }

                if (!foundVoice.active) {
                    var page = Math.ceil((voiceIndex) / voicesContainer.perPage);

                    var voices = voicesContainer.filteredResults.slice(0, voiceIndex + 60);

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
                    var index = voicesContainer.filteredResults.indexOf(voices[voices.length - 1]);

                    var beforeIndex = index + 1;

                    if (beforeIndex >= voicesContainer.filteredResults.length) {
                        voicesContainer.element[0].appendChild(fragment);
                    } else {
                        voicesContainer.element[0].insertBefore(fragment, voicesContainer.filteredResults[beforeIndex].element[0]);
                    }

                    voicesContainer.element.isotope('appended', elements);

                    voicesContainer.currentPage = page + 1;
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
                    active        : false,
                    tags          : post.tags
                });

                voicesContainer.appendChild(voice);

                fragment.appendChild(voice.element[0]);
            });

            voicesContainer.element[0].appendChild(fragment);


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

            var voices = this.filteredResults.slice(this.lastVoiceIndex, (this.perPage * (this.currentPage + 1)));

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
                voicesContainer.element[0].insertBefore(fragment, voicesContainer.filteredResults[this.lastVoiceIndex - 1].element[0]);
            }

            this.element.isotope('appended', elements);

            this.currentPage++;

            callback();    
        },

        /**
         * Check the URL looking for the 'post' param. If the URL contains the
         * 'post' params, then we check the 'post' param value agains the VoiceElements
         * looking for a match by id. If found, then we open the Overlay.
         * @method checkURLToShowOverlay <public> [Function]
         * @return this [VoicesContainer]
         */
        checkURLToShowOverlay : function (argument) {
            var postIdParam = $.deparam.querystring().post;

            if (postIdParam) {
                this.children.some(function(voiceElement) {
                  if (voiceElement.id == postIdParam) {
                    window.CV.OverlaysController.showOverlay(voiceElement);
                    return true;
                  }
                });
            }

            return this;
        },

        /**
         * Iterate over 'CV.post_votes' Object if defined, looking for
         * voiceElements to match. If a match if found, then the voiceElement
         * is updated to inform that the user has already casted a vote
         * for this voice.
         * @method checkVotedVoices <public> [Function]
         * @return this [VoicesContainer]
         *
         */
        checkVotedVoices : function() {
            var voicesContainer = this;

            if (!CV.posts_votes) {
                return this;
            }

            _.each(CV.posts_votes, function(voteObject) {
                voicesContainer.children.some(function(voiceElement) {
                    if (voiceElement.id == voteObject.id) {
                        if (voteObject.positive) {
                            voiceElement.element.find('.voice-unmoderated li.up').addClass('up_hover');
                            voiceElement.element.find('.voice-unmoderated li.down').remove();
                        } else {
                            voiceElement.element.find('.voice-unmoderated li.down').addClass('down_hover');
                            voiceElement.element.find('.voice-unmoderated li.up').remove();
                        }

                        return true;
                    }
                });
            });

            return this;
        }
    }
});
