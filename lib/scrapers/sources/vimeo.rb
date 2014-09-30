module Scrapers
  module Sources
    class Vimeo
      class Video < Struct.new(:title, :description, :image_url); end

      @@regexp = /^https?:\/\/(?:www\.)?vimeo\.com\/(?:.*#)?(\d+)/i
      cattr_reader :regexp

      attr_accessor :title, :description, :image_url

      def initialize(url)
        @url = url
      end

      def scrape(&block)
        response = get_info
        if response
          yield Video.new(@title, '', @image_url)
        else
          raise Exceptions::NotFound
        end
      end

      def to_s
        'vimeo'
      end

      def get_info
        video_id = @url.match(/(?:.*#)?(\d+)/).captures.first
        response = HTTParty.get("http://vimeo.com/api/v2/video/#{video_id}.xml")

        return nil if response.code != 200 || response.parsed_response['videos']['video'].nil?

        doc = Nokogiri::HTML(response.body)
        @title        = doc.search("title").inner_text
        @description  = doc.search("description").inner_text
        @image_url    = doc.search("thumbnail_medium").inner_text
        doc
      end
    end
  end
end