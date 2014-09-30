#!/usr/bin/env ruby
require File.expand_path('config/environment.rb')

class Imap < Thor
  desc "download", "fetchs all emails and create posts for the voices were sent"
  def download
    @scraper = Scrapers::Sources::Email.new()
    @scraper.scrape do |emails|
      logger = Logger.new('log/imap.log')
      logger.info(">>>>>>>>>>>>>>>>  #{Time.now.to_s} ")

      emails.each do |post|
        voice = Voice.find(post[:voice_id])
        logger.info("#{voice.id if voice} >>>> #{post.inspect}")

        if voice
          post[:images].each do |image|
            saved = voice.posts.create(:image_title => post[:title], :image => image)
            logger.info("#{saved.errors}") if !saved.errors.empty?
            logger.info("#{saved.id}") if saved
          end
        end
      end
    end
  end
end

Imap.start
