class Admin::InstallationsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required
  layout 'admin'

  def index
    @installations = Installation.where(:setup => true)
  end

  def show
    @installation = Installation.find(params[:id])
  end

  def new
    @installation = Installation.new
  end

  # GET /installations/1/edit
  def edit
    @installation = Installation.find(params[:id])
  end

  # POST /installations
  # POST /installations.xml
  def create
    @installation = Installation.new(params[:installation])
      if @installation.save
        redirect_to(@installation, :notice => 'Installation was successfully created.')
      else
        render :action => "new"
      end
  end

  # PUT /installations/1
  # PUT /installations/1.xml
  def update
    @installation = Installation.find(params[:id])
      if @installation.update_attributes(params[:installation])
        redirect_to(@installation, :notice => 'Installation was successfully updated.')
      else
        render :action => "edit"
      end
  end

  def customization
    @installation = CustomAttribute.first
  end

  def update_custom
    @installation = CustomAttribute.first
    if @installation.update_attributes(params[:custom_attribute])
      redirect_to customization_admin_installations_url, :notice => 'Attributes was successfully updated.'
    else
      render :action => "customization"
    end
  end

  # DELETE /installations/1
  # DELETE /installations/1.xml

  def destroy
    installation = Installation.find(params[:id])
    server_name = installation.name
    ActiveRecord::Base.connection.execute("DROP DATABASE crowdvoice_installation_#{server_name}")
    # AWS::S3::Base.establish_connection!(
    #   :access_key_id     => APP_CONFIG[:s3_access_key],
    #   :secret_access_key => APP_CONFIG[:s3_access_secret])
    # if AWS::S3::Bucket.find("crowdvoice-installation-#{server_name}")
    #   begin
    #     AWS::S3::Bucket.delete("crowdvoice-installation-#{server_name}", :force => true)
    #   rescue
    #     puts "Error in #{server_name}"
    #   end
    # end
    installation.destroy
    redirect_to admin_installations_url
  end

end
