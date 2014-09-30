# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
require 'content_length_fix'
use Nginx::ContentLengthFix
run CrowdvoiceV2::Application