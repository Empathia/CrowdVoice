module Scrapers
  module Sources
    class Twitter

      class Photo < Struct.new(:title, :description, :image_url); end

      class Api
        include HTTParty
        base_uri "http://api.twitter.com/"
        format :json
        default_timeout 20
      end

      @@regexp = /^https?:\/\/(?:www\.)?twitter\.com.*(photo)/i
      cattr_reader :regexp

      def initialize(url)
        @url = url
      end

      def scrape(&bk)
        begin
          @document = Nokogiri::HTML(open(URI.encode(@url), 'User-Agent' => "Ruby/#{RUBY_VERSION}"))
          link = @document.at_css(".media-slideshow-image")["src"]
          yield Photo.new("", "", link)
        rescue Timeout::Error, StandardError
          raise Sources::Exceptions::UnrecognizedSource
        end
      end

      def to_s
        'twitter'
      end

      def photo_id
        @url.match(/twitter\.com\/(.*)/).captures.first
      end

    end
  end
end
