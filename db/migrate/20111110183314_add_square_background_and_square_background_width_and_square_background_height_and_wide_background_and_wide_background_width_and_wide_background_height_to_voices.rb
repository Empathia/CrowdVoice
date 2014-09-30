class AddSquareBackgroundAndSquareBackgroundWidthAndSquareBackgroundHeightAndWideBackgroundAndWideBackgroundWidthAndWideBackgroundHeightToVoices < ActiveRecord::Migration
  def self.up
    add_column :voices, :square_background, :string
    add_column :voices, :square_background_width, :integer
    add_column :voices, :square_background_height, :integer
    add_column :voices, :wide_background, :string
    add_column :voices, :wide_background_width, :integer
    add_column :voices, :wide_background_height, :integer
  end

  def self.down
    remove_column :voices, :wide_background_height
    remove_column :voices, :wide_background_width
    remove_column :voices, :wide_background
    remove_column :voices, :square_background_height
    remove_column :voices, :square_background_width
    remove_column :voices, :square_background
  end
end
