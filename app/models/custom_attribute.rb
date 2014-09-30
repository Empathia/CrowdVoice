class CustomAttribute < ActiveRecord::Base
  mount_uploader :favico, FavicoUploader
end
