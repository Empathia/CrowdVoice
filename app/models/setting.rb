class Setting < ActiveRecord::Base

  validates :name, :presence => true
  validates :value, :presence => true

  def self.update_settings(params)
    Setting.positive_threshold = params['max-value']
    Setting.negative_threshold = params['min-value']
    Setting.posts_per_page = params[:posts]
  end

  def self.positive_threshold
    find_or_create_by_method_name(__method__).value.to_i
  end

  def self.negative_threshold
    find_or_create_by_method_name(__method__).value.to_i
  end

  def self.posts_per_page
    find_or_create_by_method_name(__method__).value.to_i
  end

  def self.posts_per_page_on_mobile
    find_or_create_by_method_name(__method__).value.to_i
  end

  def self.positive_threshold=(value)
    s = self.find_or_create_by_method_name(__method__)
    s.value = value
    s.save!
  end

  def self.negative_threshold=(value)
    s = self.find_or_create_by_method_name(__method__)
    s.value = value
    s.save!
  end

  def self.posts_per_page=(value)
    if value.to_i >= 25
      s = self.find_or_create_by_method_name(__method__)
      s.value = value
      s.save!
    end
  end

  def self.posts_per_page_on_mobile=(value)
    s = self.find_or_create_by_method_name(__method__)
    s.value = value
    s.save!
  end

  def self.find_or_create_by_method_name(method_name)
    m_name = method_name.to_s.titlecase.gsub('=','')
    find_by_name(m_name) || create(:name => m_name, :value => APP_CONFIG[:default_settings][method_name.to_s.gsub('=','')])
  end

end
