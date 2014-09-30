class StaticPagesController < ApplicationController
  #caches_page :sitemap

  def sitemap
    @voices = Voice.all
  end
end
