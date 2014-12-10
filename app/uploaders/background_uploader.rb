class BackgroundUploader < CarrierWave::Uploader::Base

  # Include RMagick or ImageScience support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  def remove!
     return false
  end

  # Choose what kind of storage to use for this uploader:
  # storage :s3

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

  # Provide a default URL as a default if there hasn't been a file uploaded:
  def default_url
    'https://crowdvoice-production-bucket.s3.amazonaws.com/images/Image-Placeholder.png'
  end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  version :thumb do
    process :resize_to_limit_and_save_geometry => [180, '']
  end

  def resize_to_limit_and_save_geometry(width, height)
    img = resize_to_limit(width, height)
    model.background_thumb_width, model.background_thumb_height = *img[:dimensions]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # Override the filename of the uploaded files:
  # def filename
  #   "something.jpg" if original_filename
  # end

end
