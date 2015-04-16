class Slug < ActiveRecord::Base
  belongs_to :voice
  default_scope :order => 'updated_at DESC'
  scope :default, where(:is_default => true).limit(1)

  validates :text, :uniqueness => true
  validates_presence_of :text
  validate :text_format

  def text_format
    if "#{text}".include? '/'
      errors.add(:text, "Can not contain slashes --> '/' <--")
      return false
    end
  end

end
