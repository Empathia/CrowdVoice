require 'nokogiri'
require 'open-uri'
require 'ext/string'

module Scrapers
  module Sources
    class Html
      DEFAULT_IMAGE = '/images/v4/carousel-not-image-found.jpg'
      attr_reader :document

      def initialize(url)
        @url = url
        begin
          page = open(@url).read
          # parse the page
          @document = Nokogiri::HTML(page)
          #@document = Nokogiri::HTML(open(@url).read, 'User-Agent' => "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.17 Safari/537.36")
        rescue Timeout::Error, StandardError
          raise Sources::Exceptions::UnrecognizedSource
        end
      end

      def images
        @images ||=
        begin
          fb_tag = document.at_css("link[@rel='image_src']")
          if fb_tag
            [expand_relative_path(fb_tag['href']) || DEFAULT_IMAGE]
          else
            images = document.search('img').map do |img|
              if !img.attribute('src').nil? && img.attribute('src').content =~ /\.(gif|png|jpe?g|bmp)[^\.]*$/i
                expand_relative_path(img.attribute('src').content)
              end
            end.compact
            images.empty? ? images << DEFAULT_IMAGE : images
          end
        end
      end

      def scrape(&bk)
        yield self
      end

      def title
        @title ||= scrape_title
      end

      def description
        @description ||= scrape_description
      end

      def image_url
        @image_url ||= self.images.first
      end

      def to_s
        'link'
      end

      private

      def scrape_title
        if title = document.at_css('title')
          title.content.strip
        else
          ''
        end
      end

      def scrape_description
        return meta_description['content'] if meta_description
        return '' unless content
        return '' if content.text.strip.gsub(/[\x80-\xff]/,'').blank?
        content.text.deep_strip![0...150]
      end

      def expand_relative_path(path)
        path.strip!
        return path if path =~ /^https?:\/\//
        URI.join("http://#{URI(@url).host}", URI.encode(path)).to_s
      end

      def meta_description
        @meta_description ||= document.at_css("meta[name=description]")
      end

      def content
        @content ||=
          document.at_css('article') ||
            document.at_css('#content') ||
            document.at_css('h2') ||
            document.at_css('h3') ||
            document.at_css('p') ||
            document.at_css('li') ||
            document.at_css('strong') ||
            document.at_css('div')
      end

    end
  end
end
