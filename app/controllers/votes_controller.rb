class VotesController < ApplicationController
  cache_sweeper :posts_sweeper, :only => [:create, :update, :destroy]

  def create
    post = Post.find(params[:post_id])
    vote = Vote.get_vote(params[:post_id], current_user, request.remote_ip ).pop

    if !vote.nil?
      vote.rating = params[:rating]
    else
      vote = post.votes.build(:ip_address => request.remote_ip, :rating => params[:rating])
    end

    vote.user_id = current_user if current_user

    respond_to do |format|
      if vote.save
        format.json { render :json => post.reload, :status => :ok }
      else
        format.json { render :json => vote.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    vote = Vote.find(params[:id])
    vote.destroy

    render :nothing => true
  end
end
