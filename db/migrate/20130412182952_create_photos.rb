class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :source
      t.string :source_author_profile
      t.string :source_id
      t.string :source_image_id
      t.string :source_author_username
      t.string :source_image
      t.string :licence_type
      t.string :licence_url
      t.string :image_name
      t.timestamps
    end
  end
end
