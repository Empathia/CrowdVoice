class ImageScrap
  @queue = :install_queue
  def self.perform(page_num)
    ImageScraper.new(Task.first, page_num)
  end
end
