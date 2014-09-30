class SquareBackgroundUploader < CarrierWave::Uploader::Base

  # Include RMagick or ImageScience support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

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

  def fog_host
    "http://#{self.fog_directory}.s3.amazonaws.com"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   'https://s3.amazonaws.com/crowdvoice-production/link-default.png'
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  process :save_geometry

  def save_geometry
    cache_stored_file! if !cached?
    img = ::MiniMagick::Image.open(current_path)
    model.square_background_width, model.square_background_height = *img[:dimensions]
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
