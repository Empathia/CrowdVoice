class RssFeed
  @queue = :rss_feed

  def self.perform(voice_id, server = false)
    puts ">>>>> Fetching voice rss: #{voice_id} on #{server}"
    server = server.gsub('crowdvoice_installation_', '') if server
    
    ConnectionAdapter.connect_to(server) if server
    feeder = VoiceFeeder.feed_voice(voice_id)
    ConnectionAdapter.restore_connection if server
  end
end
