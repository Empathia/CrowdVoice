module Scrapers
  module Sources
    class YouTube
      class Video < Struct.new(:title, :description, :image_url); end

      @@regexp = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=[^&]/i
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
        'youtube'
      end

      def get_info
        video_id = @url.match(/v=([^&]*)/).captures.first

        response = HTTParty.get("https://www.googleapis.com/youtube/v3/videos?id=#{video_id}&part=snippet&key=AIzaSyBM_EKNQM8Nvcw0b_CqfuPrtNJ_UlvQKFg")

        return nil if response.code != 200 || response.parsed_response == "Invalid id"

        doc = JSON.parse(response.body)

        @title        = doc["items"][0]["snippet"]["title"]
        @description  = doc["items"][0]["snippet"]["description"]

        if doc["items"][0]["snippet"]["thumbnails"]['high']
          @image_url    = doc["items"][0]["snippet"]["thumbnails"]['high']["url"].gsub('https', 'http')
        else
          @image_url    = doc["items"][0]["snippet"]["thumbnails"]['default']["url"].gsub('https', 'http')
        end
        
        doc
      end
    end
  end
end
