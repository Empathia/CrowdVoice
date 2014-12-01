// Twitter
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

Class('FacebookNavButton')({
	prototype : {
		init : function (options){
			this.buttonReceiver = document.getElementById('facebook-nav-button');
			this.fbIframe		= document.createElement('iframe');
			this.fbPath			= options.fbPath;
			this.buttonSource1	= 'http://www.facebook.com/plugins/like.php?href=';
			this.buttonSource2	= '&locale=en_US&width=85&height=21&colorscheme=light&layout=button&action=like&show_faces=false&send=false&appId=101972966529938';
			// The old compound source wasn't working, so I had to change it using the URL API
			// if revert is needed, use the compound url directly on an iframe
			// this.buttonSource1	= '//www.facebook.com/plugins/like.php?locale=en_US&amp;app_id=101972966529938&amp;href=';
			// this.buttonSource2	= '&amp;send=false&amp;layout=button_count&amp;width=150&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21';
			this.compoundSource = this.buttonSource1 + this.fbPath + this.buttonSource2;

			this.fbIframe.src = this.compoundSource;
			this.fbIframe.setAttribute('scrolling','no');
			this.fbIframe.setAttribute('frameborder','0');
			this.fbIframe.setAttribute('allowTransparency','true');
			this.fbIframe.style.border = 'none';
			this.fbIframe.style.overflow = 'hidden';
			this.fbIframe.style.width = '48px';
			this.fbIframe.style.height = '21px';

			this.buttonReceiver.appendChild(this.fbIframe);
		}
	}
});
