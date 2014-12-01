Class('SocialMediaButtons')({
    prototype : {
        init : function (options){
            this.options = {
                facebookLikeButton  : {
                    element: null
                },
                twitterTweetButton  : {
                    element: null
                },
                twitterFollow       : {
                    element: null,
                    showCount: 'none',
                    showScreenName: false
                }
            };
            $.extend(this.options, options);

            if ( this.options.facebookLikeButton.element ) {
                this.appendFacebookLikeButton();
            }

            if ( this.options.twitterTweetButton.element ) {
                this.appendTwitterTweetButton();
            }

            if ( this.options.twitterFollow.element ) {
                this.appendTwitterFollowButton();
            }

            return true;
        },

        appendFacebookLikeButton: function() {
            var iframe = '<iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href=https%3A%2F%2Fwww.facebook.com%2Fcrowdvoice&amp;send=false&amp;layout=button_count&amp;width=90&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:170px; height:21px;" allowTransparency="true"></iframe>';
            this.options.facebookLikeButton.element.innerHTML = iframe;
        },

        appendTwitterTweetButton: function() {
            var button = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://crowdvoice.org/" data-text="CrowdVoice - Tracking Voices Of Protest">Tweet</a>';
            this.options.twitterTweetButton.element.innerHTML = button;
        },

        appendTwitterFollowButton: function() {
            var ssn     = this.options.twitterFollow.showScreenName,
                sc      = this.options.twitterFollow.showCount,
                button  = '<a href="https://twitter.com/CrowdVoice" class="twitter-follow-button" data-show-screen-name="' + ssn + '" data-count="' + sc + '">Follow @CrowdVoice</a>';

            this.options.twitterFollow.element.innerHTML = button;

            !function(d,s,id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if ( !d.getElementById(id) ) {
                    js      = d.createElement(s);
                    js.id   = id;
                    js.src  = "//platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document,"script","twitter-wjs");
        }
    }
});
