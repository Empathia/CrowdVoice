class Supporter < ActiveRecord::Base
  belongs_to :voice
  validates :voice_id, :presence => true
  validates :uid, :presence => true, :uniqueness => { :scope => :voice_id }

  before_create :get_username

  def avatar_url
    "https://graph.facebook.com/#{uid}/picture"
  end

  private

  def get_username
    request = Net::HTTP.get_response URI.parse(URI.encode("https://graph.facebook.com/#{uid}/"))
    data = JSON.parse(request.body)
    self.username = data['name']
  end

end
