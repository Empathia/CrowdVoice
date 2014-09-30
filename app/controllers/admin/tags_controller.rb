class Admin::TagsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_required
  before_filter :find_tag, :only => [:edit, :update, :destroy]
  layout 'admin'

  def index
    @tags = Kaminari.paginate_array(ActsAsTaggableOn::Tag.order(:name)).page(params[:page]).per(150)
  end

  def edit
  end

  def update
    if @tag.update_attributes(params[:tag])
      taggings = ActsAsTaggableOn::Tagging.where(:tag_id => @tag.id, :taggable_type => 'Block')
      taggings.each do |tagging|
        block = Block.find(tagging.taggable_id)
        data = JSON.parse(block.data)
        data['tags'] = block.tags.map(&:name)
        block.update_attribute(:data, data.to_json)
      end

      redirect_to admin_tags_path, :notice => t('flash.admin.tags.update')
    else
      render :action => "edit"
    end
  end

  def destroy
    if @tag.delete
      redirect_to admin_tags_path, :notice => t('flash.admin.tags.destroy')
    else
      render :action => "edit"
    end
  end

  private

  def find_tag
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
  end

end

