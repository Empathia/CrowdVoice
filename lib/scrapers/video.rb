module Scrapers
  class Video

    attr_reader :url

    def initialize(url)
      @url = url
      raise Sources::Exceptions::UnrecognizedSource if scraper.nil?
    end

    def self.valid_url?(url)
      url =~ Sources::YouTube.regexp ||
        url =~ Sources::Vimeo.regexp
    end

    def scraper
      @scraper ||=
        case url
        when Sources::YouTube.regexp : Sources::YouTube.new(url)
        when Sources::Vimeo.regexp : Sources::Vimeo.new(url)
        end
    end
  end
end
