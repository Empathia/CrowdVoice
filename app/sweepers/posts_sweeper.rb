class PostsSweeper < ActionController::Caching::Sweeper
  observe Post, Vote

  def after_create(post)
    expire_cache(post)
  end

  def after_update(post)
    expire_fragment("#{current_connection}_homepage")
    expire_cache(post)
  end

  def after_destroy(post)
    expire_cache(post)
  end

  private
  def expire_cache(post)
    post = post.post if post.class.to_s == 'Vote'
    post.voice.expire_cache if post.voice
  end
end
