# encoding: utf-8

class GenericImageUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
   #include CarrierWave::RMagick
   include CarrierWave::MiniMagick

  def fog_directory
    APP_CONFIG['current_bucket']
  end

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "images/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  def fog_host
    "http://#{self.fog_directory}.s3.amazonaws.com"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  version :thumb do
    process :resize_to_fill => [90, 90]
  end

  version :thumb_timeline do
    process :resize_to_fill => [314, 200]
  end

  version :gray do
    process :resize_to_limit => [1024, 768]
    process :grayed
  end
  version :thumb, :if => :is_image?

  # version :medium do
  #   process :resize_to_limit => [1024, 768]
  # end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  # def filename
  #   "something.jpg" if original_filename
  # end
  def grayed
   manipulate! do |img|
      img.colorspace("Gray")
      img
    end
  end
  protected


  def is_image?
    mounted_as.to_s == 'image'
  end

  def is_background?
    mounted_as.to_s == 'background_image'
  end
end
