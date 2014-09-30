#!/usr/bin/env ruby
require File.expand_path('config/environment.rb')

class Voices < Thor
  desc 'update_feed_voices','Updated all the voices with the new content from the feeds'
  def update_feed_voices
    ConnectionAdapter.restore_connection
    Voice.all.each do |voice|
      puts "Enqueue update voice from feed with voice: #{voice.id}"
      Resque.enqueue(RssFeed, voice.id)
    end
  end

  desc 'update_installation_feed_voices','Updated all the voices with the new content from the feeds on each installation'
  def update_installation_feed_voices
    Installation.all.each do |installation|
      ConnectionAdapter.connect_to(installation.name)

      puts "<<<<  #{installation.name}  >>>>"

      Voice.all.each do |voice|
        puts "Enqueue update voice from feed with voice: #{voice.id}"
        Resque.enqueue(RssFeed, voice.id, installation.name)
      end
      ConnectionAdapter.restore_connection
    end
  end

  desc 'feed_voices','Feeds the voice with new content'
  method_option :voice_id, :required => false, :aliases => "-v", :type => :string
  def feed_voices
    # Logger
    logger = Logger.new("#{Rails.root}/log/feed.log")

    # Fetch all voices
    Rails.logger.info "\nStarting to fetch all voices (#{Time.now})..."
    if options[:voice_id].blank?
      VoiceFeeder.feed_voices
    else
      VoiceFeeder.feed_voice(options[:voice_id])
    end

    Rails.logger.info "Finished Fetching RSS feeds..."
  end

  desc 'feed_voices_for_installation','Feeds the voice with new content for user installations'
  method_option :voice_id, :required => false, :aliases => "-v", :type => :string
  def feed_voices_for_installation
    # Logger
    logger = Logger.new("#{Rails.root}/log/feed.log")

    # Fetch all voices
    Installation.all.each do |installation|
      Rails.logger.info "\nStarting to fetch all voices on #{installation.name} (#{Time.now})..."

      ConnectionAdapter.connect_to(installation.name)
      if options[:voice_id].blank?
        VoiceFeeder.feed_voices
      else
        VoiceFeeder.feed_voice(options[:voice_id])
      end
      ConnectionAdapter.restore_connection

      Rails.logger.info "Finished Fetching RSS feeds on #{installation.name}..."
    end
  end

end

Voices.start
