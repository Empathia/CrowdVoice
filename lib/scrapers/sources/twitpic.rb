module Scrapers
  module Sources
    class Twitpic

      class Photo < Struct.new(:title, :description, :image_url); end

      class Api
        include HTTParty
        base_uri "http://api.twitpic.com/2"
        format :json
        default_timeout 20
      end

      @@regexp = /^https?:\/\/(?:www\.)?twitpic\.com\/[^\/]+$/i
      cattr_reader :regexp

      def initialize(url)
        @url = url
      end

      def scrape(&bk)
        params = {
          :id => photo_id
        }
        response = Api.get '/media/show.json', :query => params
        if response.code == 200
          image_url = "http://twitpic.com/show/full/#{photo_id}"
          yield Photo.new(response['message'], response['message'], image_url)
        else
          raise Exceptions::NotFound
        end
      end

      def to_s
        'twitpic'
      end

      def photo_id
        @url.match(/twitpic\.com\/(.*)/).captures.first
      end

    end
  end
end
