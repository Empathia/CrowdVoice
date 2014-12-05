class Slug < ActiveRecord::Base
  belongs_to :voice
  default_scope :order => 'updated_at DESC'
  scope :default, where(:is_default => true).limit(1)

  validates :text, :uniqueness => true
end
