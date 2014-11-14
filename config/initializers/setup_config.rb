::APP_CONFIG = YAML.load_file("#{Rails.root}/config/config.yml")[Rails.env].symbolize_keys!

# Ensure the agent is started using Unicorn.
# This is needed when using Unicorn and preload_app is not set to true.
# See https://newrelic.com/docs/ruby/no-data-with-unicorn
# if defined? Unicorn
#   ::NewRelic::Agent.manual_start()
#   ::NewRelic::Agent.after_fork(:force_reconnect => true)
# end

CarrierWave.configure do |config|
  config.fog_credentials = {
    :provider               => 'AWS',
    :aws_access_key_id      => APP_CONFIG[:s3_access_key],
    :aws_secret_access_key  => APP_CONFIG[:s3_access_secret]
  }

  #load remote images
  #config.fog_directory  = "crowdvoice-#{Rails.env}" #nomal prod load
  config.fog_public     = true
  config.fog_directory  = "crowdvoice-production-bucket" #force load remote images locally

  config.fog_attributes = {'x-amz-storage-class' => 'REDUCED_REDUNDANCY'}

  #load remote images
  config.storage = Rails.env.development? ? :file : :fog #normal prod load
  config.storage = :fog
  #config.storage = :fog #force load remote images locally


  if Rails.env.test?
    config.enable_processing = false
  end
  #If you would like to remove unused tag objects after removing taggings
  #ActsAsTaggableOn.remove_unused_tags = true
end
