json.version @version

json.events @events do |j, event|
  j.extract! event, :id, :name, :description, :event_date
  j.background_image event.background_image.thumb.url
  j.fade_image event.background_image.gray.url
  j.is_event event.is_event
  j.images event.related_images do |j2, image|
    j2.image image.image.url
    j2.caption image.caption
    j2.is_explicit image.is_explicit
  end
  j.videos event.related_videos do |j2, video|
    j2.video video.url
    j2.caption video.caption
    j2.is_explicit video.is_explicit
  end
  if event.sources.present?
    sources = event.sources
    split_source = sources.split(/\n/)
    j.sources split_source do |j2, s|
      url = s.gsub(/^\s+/,'').gsub(/\s+$/,'')
      parts = url.split( /\[(.*?)\]/ )
      if parts[1]
        label = parts[1].gsub(/^\s+/,'').gsub(/\s+$/,'')
        j2.label label
      end
      if parts[2]
        source = parts[2].gsub(/^\s+/,'').gsub(/\s+$/,'')
        j2.url source
      end
    end
  end
end
