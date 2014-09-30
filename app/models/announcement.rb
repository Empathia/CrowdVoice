class Announcement < ActiveRecord::Base
  belongs_to :voice

  validates :title, :presence => true
  validates :content, :presence => true
  validates :voice_id, :presence => true
  validates :url, :format => { :with => URI.regexp(%w[http https]), :allow_nil => true }
end