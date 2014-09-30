class FavicoUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  # storage :fog
  def fog_directory
    APP_CONFIG['current_bucket']
  end

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    db = ActiveRecord::Base.connection.instance_variable_get("@config")[:database]
    if db != "crowdvoice_production"
      name = db.gsub('crowdvoice_installation_', '')
      "#{name}/uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
    else
      "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
    end
  end
  def default_url
    'https://crowdvoice-production-bucket.s3.amazonaws.com/images/Image-Placeholder.png'
  end

  def fog_host
    "http://#{self.fog_directory}.s3.amazonaws.com"
  end
  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(ico)
  end

  # Override the filename of the uploaded files:
  # def filename
  #   "something.jpg" if original_filename
  # end

end
