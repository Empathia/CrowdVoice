module Scrapers
  module Sources
    class RawImage
      class Photo < Struct.new(:title, :description, :image_url); end

      @@regexp = /\/.*\.(jpe?g|png|gif)(?:\?.*)?$/i
      cattr_accessor :regexp

      def initialize(url)
        @url = url
      end

      def scrape(&bk)
        yield Photo.new(filename, filename, URI.decode(@url))
      end

      def to_s
        'raw'
      end

      def filename
        URI.decode(@url.match(/([^\/]+\.(?:jpe?g|png|gif))(?:\?.*)?$/i).captures.first)
      end

      def extension
        @url.match(@@regexp).captures.first
      end
    end
  end
end
