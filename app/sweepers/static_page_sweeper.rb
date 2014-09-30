class StaticPageSweeper < ActionController::Caching::Sweeper
  observe Voice

  def after_save(voice)
    expire_cache(voice)
  end

  def after_destroy(voice)
    expire_cache(voice)
  end

  def expire_cache(voice)
    expire_page '/sitemap.xml'
  end
end