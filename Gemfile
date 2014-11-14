source 'http://rubygems.org'

gem 'rake', '0.8.7'
gem 'unicorn', '3.6.2'
gem 'linecache', '0.43'
gem 'rails', '3.0.9'
gem "rails3-generators"
gem 'jquery-rails', '~> 0.2'
gem 'fog', '0.8.2'
gem 'json'
gem 'jbuilder', '~> 0.4.0'
gem 'resque', :require => "resque/server"
gem 'resque-timeout'
# gem "SystemTimer", "~> 1.2.3"
#gem 'hoptoad_notifier'

gem "bcrypt-ruby", '~> 2.1', :require => 'bcrypt'
gem "httparty", '~> 0.6.1'
gem "carrierwave", '~> 0.5'
gem "mini_magick", '~> 3.2'
gem "nokogiri", "1.5.9"
gem "tmail"
gem "aws-s3"
gem "aws-sdk", "~> 1.11.3"
gem 'mysql2', '0.2.7'
gem "faraday", "0.8.8"
gem 'twitter', '4.0.0'
gem 'kaminari', '0.14.1'
gem 'whenever', :require => false
gem 'jammit', '0.6.5'
gem 'memcache-client'
gem 'acts_as_list', '~> 0.1.4'
gem 'acts-as-taggable-on', :git => "git://github.com/mbleigh/acts-as-taggable-on.git", :ref => "53e2e14f3cf4d3359ef740c78bec7a36c5378bc6"
gem "foreman", "~> 0.60.2"
gem "hominid"
gem 'newrelic_rpm'
gem "haml-rails"
gem 'rack', '~> 1.5.2', :require => false

group :staging, :staging do
	# gem "rack-mini-profiler", "0.1.30"
	gem 'wordnet', '~> 0.0.5'
end


group :production, :staging do
	gem 'wordnet', '~> 0.0.5'
end

group :development, :test do
  gem 'ruby-debug'
  gem "shoulda", '~> 2.11'
  gem "rspec-rails", "~> 2.5"
  #gem "factory_girl_rails", '~> 1'
end
