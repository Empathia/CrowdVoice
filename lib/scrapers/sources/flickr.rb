module Scrapers
  module Sources
    class Flickr

      class Photo < Struct.new(:title, :description, :image_url); end

      class Api
        include HTTParty
        base_uri "http://api.flickr.com/services/rest"
        format :xml
      end

      @@regexp = /^https?:\/\/(?:www\.)?flickr\.com\/photos\/[-\w@]+\/\d+/i
      cattr_reader :regexp

      def initialize(api_key, url)
        @api_key, @url = api_key, url
      end

      def scrape(&bk)
        params = {
          :method => 'flickr.photos.getInfo',
          :photo_id => photo_id,
          :api_key => @api_key
        }
        response = Api.get '/', :query => params
        if response.code == 200 && (photo = response['rsp']['photo'])
          image_url = "http://farm#{photo["farm"]}.static.flickr.com/#{photo["server"]}/#{photo["id"]}_#{photo["secret"]}.jpg"
          yield Photo.new(photo['title'], photo['title'], image_url)
        else
          raise Exceptions::NotFound
        end
      end

      def to_s
        'flickr'
      end

      def photo_id
        @url.match(/\/photos\/.*\/(\d+)(?:\/.*)?$/).captures.first
      end

    end
  end
end
