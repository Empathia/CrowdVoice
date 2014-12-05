require 'fileutils'

class Admin::BlocksController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required
  before_filter :find_voice, :except => [:all]
  before_filter :find_block, :only => [:edit, :update, :destroy, :reorder]
  before_filter :find_cliparts, :only => [:edit, :update, :new]

  layout 'admin'

  def all
    @blocks = Block.page(params[:page])
  end

  def index
    @blocks = @voice.blocks.page(params[:page])
  end

  def new
    @block = @voice.blocks.new
    chart = @block.build_chart
    chart.chart_values.build
  end

  def edit
    @block = @voice.blocks.find(params[:id])
  end

  def create
    @block = @voice.blocks.new(params[:block])

    if @block.save
      if JSON.parse(@block.data)["type"] == "custom-image"
        chart = Chart.create(:block_id => @block.id, :chart_type => "custom-image")
        chart.update_attribute(:remote_static_image_url, JSON.parse(@block.data)["graphic"] )

        x = JSON.parse(@block.data)
        x['graphic'] = @block.chart.static_image_url
        @block.data = x.to_json
        @block.save
      end
      redirect_to admin_voice_blocks_path(@voice), :notice => t('flash.admin.blocks.create')
    else
      render :action => "new"
    end
  end

  def update
    if @block.update_attributes(params[:block])
      data = JSON.parse(@block.data)
      if data["type"] == "custom-image"
        if @block.chart.nil?
          chart = Chart.create(:block_id => @block.id, :chart_type => "custom-image") if @block.chart.nil?
          chart.update_attribute(:remote_static_image_url, data["graphic"] )
          @block.reload!
        else
          @block.chart.update_attribute(:remote_static_image_url, data["graphic"] )
        end
        x = JSON.parse(@block.data)
        x['graphic'] = @block.chart.static_image_url
        @block.data = x.to_json
        @block.save
      end
      redirect_to admin_voice_blocks_path(@voice), :notice => t('flash.admin.blocks.update')
    else
      render :action => "edit"
    end
  end

  def destroy
    if @block.destroy
      redirect_to admin_voice_blocks_path(@voice), :notice => t('flash.admin.blocks.destroy')
    else
      render :action => "edit"
    end
  end

  # /admin/voices/:voice_id/blocks/:id/reorder?pos=:number
  def reorder
    updated = @block.update_position(params[:pos].to_i)

    if updated
      render :nothing => true, :status => :ok
    else
      render :nothing => true, :status => :unprocessable_entity
    end
  end

  def image_preview
    file = params[:file].tempfile
    path = File.join("public/tmp", params[:file].original_filename)
    FileUtils.cp(file.path, path)
    render :json => {:url => "#{root_url}tmp/#{params[:file].original_filename}"}, :layout => false
  end

  private

  def find_block

    @block = @voice.blocks.find(params[:id])
  end

  def find_cliparts
    @cliparts = Clipart.all
  end

  def find_voice
    slug = Slug.find_by_text(params[:voice_id])
    @voice = slug.voice
  end

end
