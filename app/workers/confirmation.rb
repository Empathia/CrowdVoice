class Confirmation
  def perform(subscription_id)
    subscription = ::Subscription.find(subscription_id)
    ::NotifierMailer.subscription_confirmation(subscription).deliver
  end
end
