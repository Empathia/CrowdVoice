module Scrapers
  class Feed
    cattr_reader :regexp
    @@regexp = URI::regexp(%w[http https])

    attr_reader :url

    def initialize(url)
      @url = url
      raise Sources::Exceptions::UnrecognizedSource unless self.class.valid_url?(url)
    end

    def self.valid_url?(url)
      url =~ regexp
    end

    def scraper
      Sources::Rss.new(url)
    end
  end
end