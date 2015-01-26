#!/usr/bin/env ruby
require File.expand_path('config/environment.rb')

class Subscriptions < Thor
  desc "send_digest", "Delivers a digest with all today's contents to the subscriptions"
  def send_digest

    Subscription.all.each do |subscription|
      case subscription.frequency
      when "daily"
        if subscription.updated_at <= 1.day.ago
          @count = subscription.voice.posts.daily.count
          ::NotifierMailer.notification(subscription, @count).deliver
          subscription.touch
        end
      when "weekly"
        if subscription.updated_at <= 1.week.ago
          @count = subscription.voice.posts.weekly.count
          ::NotifierMailer.notification(subscription, @count).deliver
          subscription.touch
        end
      when "biweekly"
        if subscription.updated_at <= 2.weeks.ago
          @count = subscription.voice.posts.biweekly.count
          ::NotifierMailer.notification(subscription, @count).deliver
          subscription.touch
        end
      when "monthly"
        if subscription.updated_at <= 1.month.ago
          @count = subscription.voice.posts.monthly.count
          ::NotifierMailer.notification(subscription, @count).deliver
          subscription.touch
        end
      when "quarterly"
        if subscription.updated_at <= 3.months.ago
          @count = subscription.voice.posts.quarterly.count
          ::NotifierMailer.notification(subscription, @count).deliver
          subscription.touch
        end
      when "biannually"
        if subscription.updated_at <= 6.weeks.ago
          @count = subscription.voice.posts.biannually.count
          ::NotifierMailer.notification(subscription, @count).deliver
          subscription.touch
        end
      when "annually"
        if subscription.updated_at <= 1.year.ago
          @count = subscription.voice.posts.annually.count
          ::NotifierMailer.notification(subscription, @count).deliver
          subscription.touch
        end
      end
    end
  end
end

# Subscription.start
