module ApplicationHelper
  def head(&block)
    content_for(:head) { block.call }
  end

  def title(page_title, options={})
    content_for(:title, page_title.to_s)
    return content_tag(:h1, page_title, options)
  end

  # Include javascript files within the +<head>+ tags
  def javascript(*args)
    args = args.map { |arg| arg == :defaults ? arg : arg.to_s }
    head { javascript_include_tag *args }
  end

  # Include stylesheet files within the +<head>+ tags
  def stylesheet(*args)
    head { stylesheet_link_tag *args }
  end

  def cache_key_for_posts(voice)
    mod_key = params[:mod] ? 'mod' : 'public'
    (current_user && current_user.is_admin?) ? "#{current_connection}_admin_voice_#{voice.id}_#{mod_key}" : "#{current_connection}_voice_#{voice.id}_#{mod_key}"
  end

  def verify_link_text(voice)
    "Activate"
  end

  def google_analytics
    code = <<-eos
    <script type="text/javascript">

      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-298928-15']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>
    eos
    code.html_safe
  end

  def fb_path
    voice_url(@voice,:protocol=>'http') + "/"
  end

  def from_gaza?
    request.path =~ /^\/gaza/ ? true : false
  end

  def cache_if (condition, name = {}, &block)
    if condition
      cache(name, &block)
    else
      yield
    end
    return nil
  end

  def is_mobile?
    request.env['HTTP_USER_AGENT'] =~ /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  end

end
