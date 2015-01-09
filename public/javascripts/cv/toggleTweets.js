Class('ToggleTweets')({
    prototype: {
        init: function(element, options) {
            this.options = {
                hidden      : false,
                toggler     : '.filters input[name="tweets"]',
                scroller    : '.tweets-wrapper-list',
                header      : 'header',
                specialClass: '',
                voices      : '.voices-container',
                sweeper     : '.voice-wrapper .sweeper',
                topscroll   : '.top-scroll',
                bottomscroll: '.bottom-scroll'
            };
            $.extend(this.options, options);

            this.element    = typeof element == "string" ? $(element) : element;
            this.loader     = this.element.find('.loader');
            this.win        = $(window);
            this.toggler    = $(this.options.toggler);
            this.scroller   = $(this.options.scroller);
            this.header     = $(this.options.header);
            this.voices     = $(this.options.voices);
            this.sweeper    = $(this.options.sweeper);
            this.topscroll  = $(this.options.topscroll);
            this.bottomscroll = $(this.options.bottomscroll);
            this.filtersContainer = $('.filters');
            this.tagsContainer = $('.tags-container');
            this.transitionDuration = parseFloat(this.element.css('transition-duration'), 10) * 1000;
            this.options.hidden ? this.hide() : this.show();
            if (this.options.specialClass) this.element.addClass( this.options.specialClass );
            this.toggler.prop('checked', false);
            this.bindEvents();

            
        },

        bindEvents : function() {
            var selfclass = this;

            this.toggler.bind('change', function () {
                if (selfclass.toggler.is(':checked')) {
                    selfclass.show();
                    selfclass.updatePosition();
                } else {
                    selfclass.hide();
                }
            });

            this.win.bind('load resize', function(){
                selfclass.updatePosition();
            });

            this.filtersContainer.bind('filter.apply', function(){
                selfclass.hide();
            });
            this.tagsContainer.bind('tags.show', function(){
                selfclass.hide(true);
            });
            $('.sidebar-wrapper').bind('sidebar.toggle', function() {
                selfclass.updatePosition();
            });
        },

        loadTweets : function(){
            var selfclass   = this,
                query       = $('.tweets-sidebar').data('search'),
                list        = $('ul.tweets-list'),
                tweetsLoaded, URLtoLink;

            this.loader.addClass('loader--show');

            tweetsLoaded = function() {
                selfclass.element.data().loaded = true;
                selfclass.loader.toggleClass('loader--show');
            };

            if ( query != '' && typeof query !== 'undefined' ) {
                URLtoLink = function(text) {
                    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
                };

                $.ajax({
                    url : '/twitter_search',
                    data : {'search' : query},
                    type : 'get',
                    dataType : 'json',
                    success : function (data) {
                        var results = data;
                        if ( results.length > 0 ) {
                            list.html('');
                            $.each(results, function(index, value) {
                                var tmp_li, tweetText;

                                tmp_li = '\
                                    <li class="tweet">\
                                        <cite>\
                                            <span class="author">@{{FROM_USER}}</span>\
                                            <span class="date">{{TIME}}</span>\
                                        </cite>\
                                        <blockquote cite="@{{USER}}">\
                                            <q lang="en-us">{{TEXT}}</q>\
                                        </blockquote> \
                                    </li>\
                                ';

                                tweetText = URLtoLink(this.text);

                                tmp_li = tmp_li.replace(/{{USER}}/g, '');
                                tmp_li = tmp_li.replace(/{{TEXT}}/g, tweetText);
                                tmp_li = tmp_li.replace(/{{FROM_USER}}/g, this.user.name);
                                tmp_li = tmp_li.replace(/{{TIME}}/g, moment(this.created_at).fromNow());

                                list.append(tmp_li);
                                tweetText = tmp_li = null;
                            });

                            // set that tweets have been loaded
                            tweetsLoaded();
                        }
                        results = null;
                    }
                });
            } else {
                var noTweets = '\
                    <li class="tweet">\
                        <p>No tweets found.</p>\
                    </li>\
                ';
                list.append( noTweets );
                tweetsLoaded();
                noTweets = null;
            }


            return selfclass;
        },

        show : function() {
            var selfclass = this;

            var toggleTweets = this;

            if (!this.loaded) {
                if (window.currentVoice.tweets.length === 0) {
                    var noTweets =      '<li class="tweet">\
                                            <p>No tweets found.</p>\
                                        </li>\
                                        ';

                    $('ul.tweets-list').append($(noTweets));
                } else {
                    $('.tweets-wrapper-list .loader').show();
                    setTimeout(function() {
                        

                        _.each(window.currentVoice.tweets, function(tweet, i) {
                            tweet = tweet.tweet;
                        
                            twttr.widgets.createTweet(
                                tweet.id_str,
                                toggleTweets.scroller[0],
                                {
                                    theme : 'light'
                                }
                            ).then(function() {
                                if (window.currentVoice.tweets.length - 1 === i) {
                                    $('.tweets-wrapper-list .loader').hide();
                                };
                            });    
                        
                        });
                    }, 350)
                }
                
            }  
            
            this.loaded = true;

            this.element.addClass('open');
            this.shown = true;

            setTimeout(function(){
                selfclass.element.trigger('tweets.change');
            }, this.transitionDuration);
            return selfclass;
        },

        hide : function(doResponsive) {
            var selfclass = this,
                doResponsive = doResponsive || false;
            if (doResponsive) {
                if (window.innerWidth <= 460) {
                    this.element.removeClass('open').fadeOut();
                    this.toggler.attr('checked', false);
                    this.shown = false;
                } else {
                    return false;
                }
            }

            // this.element.removeClass('open').fadeOut();
            this.element.removeClass('open');
            this.toggler.attr('checked', false);
            this.shown = false;
            setTimeout(function(){
                selfclass.element.trigger('tweets.change');
            }, this.transitionDuration);
            return selfclass;
        },

        updatePosition: function () {
            var selfclass = this, smallScreen, topPos, scrollerHeight;
            clearTimeout( this.resizeTimer );
            this.resizeTimer = setTimeout(function() {
                smallScreen = window.innerWidth <= 461,
                topPos = smallScreen ? 36 : selfclass.header.outerHeight(true),
                selfclass.element.css('top', topPos);
                return selfclass;
            }, 100);
        }
    }
});
