class SettingsInitialValues < ActiveRecord::Migration
  def self.up
    execute "insert into settings (name,value) values('Positive Threshold','#{APP_CONFIG[:default_settings]['positive_threshold']}')"
    execute "insert into settings (name,value) values('Negative Threshold','#{APP_CONFIG[:default_settings]['negative_threshold']}')"
    execute "insert into settings (name,value) values('Posts Per Page','#{APP_CONFIG[:default_settings]['posts_per_page']}')"
  end

  def self.down
    execute "delete from settings where name = 'Positive Threshold'"
    execute "delete from settings where name = 'Negative Threshold'"
    execute "delete from settings where name = 'Posts Per Page'"
  end
end