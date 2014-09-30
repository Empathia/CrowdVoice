class DataMover
  def initialize(user_id, name)
    @user_id = user_id
    @old_user = User.find(@user_id)

    # TODO: Move this to the user model
    # Create the new installation on crowdvoice
    @new_install = Installation.new(:email => @old_user.email, :name => name)
    #@new_install.setup = true
    @new_install.save
  end

  # Create and migrate the new database base on the original crowdvoice migrations
  def migrate_database
    # Creating the new database
    ActiveRecord::Base.connection.execute("CREATE DATABASE `crowdvoice_installation_#{@new_install.name}`")
    @default_config ||= ActiveRecord::Base.connection.instance_variable_get("@config").dup

    # Connect to new database
    # TODO: Fix server name, shouldn't use the crowdvoice_installation prefix
    ActiveRecord::Base.establish_connection(@default_config.dup.update(:database => "crowdvoice_installation_#{@new_install.name}"))

    #Migrating database

    ActiveRecord::Migrator.migrate("db/migrate/")
    @new_user = @old_user.clone
    @new_user.is_admin = true
    @new_user.save(:validate => false)
    @server_install = Installation.create(:email => @new_user.email, :name => "crowdvoice-installation-#{@new_install.name}")
    CustomAttribute.create(
      :name => @new_install.name,
      :logo => @new_install.name,
      :twitter => 'http://twitter.com/intent/tweet?source=webclient&text=Tracking+voices+of+protest+-+http%3A%2F%2Fwww.crowdvoice.org',
      :facebook => 'https://www.facebook.com/sharer.php?t=Tracking+voices+of+protest&u=http%3A%2F%2Fwww.crowdvoice.org',
      :title => @new_install.name,
      :message => "Modify this message on your admin area!")
  end

  def create_bucket
    # Connect to AWS services
    #connection = Fog::Storage.new(:provider => 'AWS', :aws_access_key_id => APP_CONFIG[:s3_access_key], :aws_secret_access_key => APP_CONFIG[:s3_access_secret])
    s3 = AWS::S3.new(
      :access_key_id => APP_CONFIG[:s3_access_key],
      :secret_access_key => APP_CONFIG[:s3_access_secret])
    bucket = s3.buckets["crowdvoice-installations"]

    bucket.objects.create("#{@new_install.name}/", "", :acl => :public_read)
    # unless connection.directories.map{|b| b.key}.include?("crowdvoice-installation-#{@new_install.name}")
    #   connection.directories.create(:key => "crowdvoice-installation-#{@new_install.name}", :public => false)
    # end
    # Define the new bucket as current
    APP_CONFIG['current_bucket'] = "crowdvoice-installations"
  end

  def load_dummy_data
    # Create dummy voice
    v = Voice.create!(:title => 'This is a test voice',
      :description => 'This is a test voice that is loaded on db/seeds.rb',
      :theme => 'green',
      :user_id => 1,
      :slug => "this-is-a-test-voice",
      :twitter_search => 'crowdvoice',
      :location => 'Mexico',
      :latitude => 23.634501,
      :longitude => -102.55278399999997,
      :featured => 1,
      :archived => 0,
      :approved => 0,
      :is_witness_gaza => 0,
      :background_thumb_width =>180,
      :background_thumb_height =>164,
      :background_version=> "square",
      :square_background=> File.open("#{Rails.root}/public/seeds/Banksy_Flower_Thrower.jpg"),
      :square_background_width=>1920,
      :square_background_height=>1200,
      :wide_background=> File.open("#{Rails.root}/public/seeds/1-12.jpg"),
      :wide_background_width=>450,
      :wide_background_height=>300,
      :home_position=>1,
      :background => File.open("#{Rails.root}/public/seeds/432374_10150572827781664_1336151260_n.jpg")
    )
    v.user = @new_user
    v.save
    v.approved = 1
    v.save
  end

  def run
    # Keep reference for the user created on crowdvoice on the new installation
    User.find(@user_id).destroy

    migrate_database
    create_bucket
    load_dummy_data

    NotifierMailer.server_confirmation(@new_user).deliver
    ConnectionAdapter.restore_connection
    @new_install.setup = true
    @new_install.save
  end

  def self.migrate_all_db
    @default_config ||= ActiveRecord::Base.connection.instance_variable_get("@config").dup
    Installation.all.each do |install|
      ActiveRecord::Base.establish_connection(@default_config.dup.update(:database => "crowdvoice_installation_#{install.name}"))
      Rails.logger.info ">>>>>> Connected to: #{ActiveRecord::Base.connection.instance_variable_get("@config")[:database]}"
      #Migrating database
      ActiveRecord::Migrator.migrate("db/migrate/")
    end
  end

  def self.destroy(server_name)
    ActiveRecord::Base.connection.execute("DROP DATABASE crowdvoice_installation_#{server_name}")
    connection = AWS::S3::Base.establish_connection!(
      :access_key_id     => APP_CONFIG[:s3_access_key],
      :secret_access_key => APP_CONFIG[:s3_access_secret])
    if AWS::S3::Bucket.find("crowdvoice-installation-#{server_name}")
      begin
        AWS::S3::Bucket.delete("crowdvoice-installation-#{server_name}", :force => true)
      rescue
        puts "Error in #{server_name}"
      end
    end
  end
end
