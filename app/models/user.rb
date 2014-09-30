class User < ActiveRecord::Base
  attr_accessible :username, :email, :password, :is_admin, :server_name

  has_many :voices, :dependent => :destroy
  has_many :votes

  attr_accessor :password, :server_name
  before_save :encrypt_password, :unless => lambda { self.setup }

  validates :username, :uniqueness => {:case_sensitive => true}, :presence => true, :if => Proc.new {|user| user.server_name.blank?}
  validates :server_name, :format => {:with=> /^[a-z_\d]*$/,:message => "invalid characters"}, :unless => Proc.new {|user| user.server_name.blank?}
  validates :email,
    :presence => true,
    :format => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  validates :email,
    :uniqueness => true,
    :if => Proc.new {|user| user.server_name.blank?}

  validates :password, :presence => { :on => :create }, :confirmation => true
  validates_length_of :password, :minimum => 6, :too_short => "please enter at least 6 characters", :unless => Proc.new { |u| u.password.blank? }
  validate :installation_valid


  def self.authenticate(email, password)
    user = where('username = :login or email = :login', {:login => email}).pop
    user if user &&
      user.encrypted_password == BCrypt::Engine.hash_secret(password, user.password_salt)
  end

  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.encrypted_password = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end

  def reset_token
    self.reset_password_token = BCrypt::Engine.generate_salt
    self.save(:validate => false)
  end

  def create_auth_token
    self.auth_token = BCrypt::Engine.generate_salt
    self.save(:validate => false)
  end

  def custom_update_attributes(params)
    if params[:password].blank?
      params.delete :password
      params.delete :password_confirmation
      update_attributes params
    else
      update_attributes params
    end
  end

  private
  def installation_valid
    errors.add(:server_name, "Installation name is Invalid") if ( self.new_record? && ['gaza', 'admin', 'www'].include?(self.server_name))
    errors.add(:server_name, "Invalid characters") if ( self.server_name && self.new_record? && !self.server_name.ascii_only? && !self.server_name.include?('_'))
    if self.server_name && self.server_name.ascii_only?
      errors.add(:server_name, "was taken") if ( self.new_record? && Installation.where(:name => self.server_name).length > 0)
    end
  end
end
