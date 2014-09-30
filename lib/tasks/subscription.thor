#!/usr/bin/env ruby
require File.expand_path('config/environment.rb')

class Subscription < Thor
  desc "digest", "Delivers a digest with all today's contents to the subscriptions"
  def digest
    # OPTIMIZE: send only one mail per voice to all users subscribed as bcc
    Subscription.all.each do |subscription|
      Resque.enqueue(DigestWorker, subscription.id)
    end
  end
end

Subscription.start
