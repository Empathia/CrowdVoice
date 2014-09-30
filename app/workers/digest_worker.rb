class DigestWorker
  def perform(subscription_id)
    subscription = ::Subscription.find(subscription_id)
    ::NotifierMailer.daily_digest(subscription).deliver
  end
end
