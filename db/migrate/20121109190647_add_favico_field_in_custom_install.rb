class AddFavicoFieldInCustomInstall < ActiveRecord::Migration
  def self.up
    add_column :custom_attributes, :favico, :string
    add_column :custom_attributes, :message, :string
  end

  def self.down
    remove_column :custom_attributes, :favico
    remove_column :custom_attributes, :message
  end
end
