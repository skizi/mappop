class LikesController < ApplicationController
  def index
  end

  def show
    @like = Like.find(params[:id])
  end


  def all
    @likes = Like.all
    respond_to do |format|
      format.html{ render :all }
      format.json{
        render json: @likes
      }
    end
  end


  def get_likes
    @likes = Like.where( question_id: params['question_id'] )
    respond_to do |format|
      format.html{ render :all }
      format.json{
        render json: @likes
      }
    end
  end


  def new
    @like = Like.new
    @like.user_id = params[:user_id]
  end


  def create
    if params['question_id']
      @like = Like.new
      @like.user_id = params['user_id']
      @like.question_id = params['question_id']
    else
      @like = Like.new(like_params)
    end
    

    respond_to do |format|
      if @like.save
        str = 'いいねが投稿完了しました。' + @like.user_id.to_s
        format.html{ redirect_to @like, notice: str }
        format.json{ render :show, status: :created, location: @like }
      else
        format.html{ render :new }
        format.json{ render json: @like.errors, status: :unprocessable_entity }
      end
    end

  end


  def like_params
    params.require(:like).permit(:user_id, :question_id)
  end


end
