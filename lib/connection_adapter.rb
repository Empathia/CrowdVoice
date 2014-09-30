class ConnectionAdapter
  # Connect to the installation specified
  def self.connect_to(name = Rails.env)
    if name != Rails.env
      config= ActiveRecord::Base.connection.instance_variable_get("@config")
      ActiveRecord::Base.establish_connection(config.dup.update(:database => "crowdvoice_installation_#{name}"))
      APP_CONFIG['current_bucket'] = "crowdvoice-installations"
    else
      ActiveRecord::Base.configurations = YAML::load(IO.read('config/database.yml'))
      ActiveRecord::Base.establish_connection(Rails.env)
      #APP_CONFIG['current_bucket'] = "crowdvoice-#{Rails.env}"
      APP_CONFIG['current_bucket'] = "crowdvoice-production-bucket"
    end

    ActiveRecord::Base.connection
    Rails.logger.info ">>>>>> Connected to: #{ActiveRecord::Base.connection.instance_variable_get("@config")[:database]}"
  end

  # Return the current connection
  def self.connected_to
    ActiveRecord::Base.connection.instance_variable_get("@config")[:database]
  end

  # Return the name for the installation
  def self.installation_name
    name = ActiveRecord::Base.connection.instance_variable_get("@config")[:database].gsub('crowdvoice_installation_', '')
    name == Rails.env ? '' : name
  end

  # Restore crowdvoice original connection
  def self.restore_connection
    ConnectionAdapter.connect_to
  end
end
