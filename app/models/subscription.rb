class Subscription < ActiveRecord::Base
  belongs_to :voice
  attr_accessible :type, :email, :email_hash, :voice_id
  validates :email, :presence => {
                      :message => "cannot be empty."
                    },
                    :format => {
                      :with => %r{^(?:[_a-z0-9-]+)(\.[_a-z0-9-]+)*@([a-z0-9-]+)(\.[a-zA-Z0-9\-\.]+)*(\.[a-z]{2,4})$}i,
                      :messsage => "is invalid"

                    },
                    :uniqueness => {
                      :scope => :voice_id,
                      :message => "has already been subscribed."
                    }
  validates :email_hash,
    :uniqueness => true

  before_save :generate_email_hash

  def to_param
    email_hash
  end

  private

  # Hashes an email along with the id of the subscription to get
  # a key for the unsubscribe param
  def generate_email_hash
    self.email_hash = Digest::MD5.hexdigest([email, Time.now.to_i].join("--"))[0...6]
  end
end