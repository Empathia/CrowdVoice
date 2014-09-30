require 'nokogiri'
require 'open-uri'
require 'ext/string'

module Scrapers
  module Sources
    class Rss
      attr :last_rss

      def initialize(url, last_rss = nil)
        @url = url
        @last_rss = last_rss
        @links = []
        begin
          @document = Nokogiri::XML.parse(open @url)
        rescue Errno::ENOENT, SocketError
          raise Sources::Exceptions::UnrecognizedSource
        end
      end

      def scrape(&bk)
        get_urls
        yield @links, @last_rss
      end

      def get_urls
        @pubDate = ''
        @document.search('rss/channel/item').each do |node|
          link = node.search('link').text
          etag = node.search('etag').text
          dateElement = node.search('pubDate').text
          dateElement = @document.search('rss/channel/pubDate').text if dateElement.nil? || dateElement.empty?
          @pubDate = DateTime.parse(dateElement || Date.today.to_s)

          @last_rss = @pubDate if (!last_rss.nil? && (last_rss <=> @pubDate) >= 0)

          # compare dates
          if !last_rss.nil? && (@last_rss <=> @pubDate) >= 0
            Rails.logger.info "RssFeeder: Reached last RSS! stoping..."
            break
          end

          @links << link
        end
        @last_rss = @pubDate if last_rss.nil?
      end

    end
  end
end