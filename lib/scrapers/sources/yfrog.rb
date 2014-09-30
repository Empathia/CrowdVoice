module Scrapers
  module Sources
    class Yfrog

      class Photo < Struct.new(:title, :description, :image_url); end

      class Api
        include HTTParty
        base_uri "http://yfrog.com/api/"
        format :xml
      end

      @@regexp = /^https?:\/\/(?:www\.)?yfrog\.com\/[^\/]+$/i
      cattr_reader :regexp

      def initialize(api_key, url)
        @api_key, @url = api_key, url
      end

      def scrape(&bk)
        params = {
          :path => photo_id,
          :key => @api_key
        }
        response = Api.get '/xmlInfo', :query => params
        if response.code == 200
          image_url = response.parsed_response['imginfo']['links']['image_link']
          yield Photo.new('', '', image_url)
        else
          raise Exceptions::NotFound
        end
      end

      def to_s
        'yfrog'
      end

      def photo_id
        @url.match(/yfrog\.com\/(.*)/).captures.first
      end

    end
  end
end