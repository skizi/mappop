class CommentsController < ApplicationController
  def index
  end

  def show
    @comment = Comment.find(params[:id])
  end


  def all
    @comments = Comment.all
    respond_to do |format|
      format.html{ render :all }
      format.json{
        render json: @comments
      }
    end
  end


  def get_comments
    @comments = Comment.where( question_id: params['question_id'] )
    respond_to do |format|
      format.html{ render :all }
      format.json{
        render json: @comments
      }
    end
  end


  def new
    @comment = Comment.new
    @comment.user_id = params[:user_id]
  end


  def create
    if params['content']
      @comment = Comment.new
      @comment.content = params['content']
      @comment.user_id = params['user_id']
      @comment.question_id = params['question_id']
    else
      @comment = Comment.new(comment_params)
    end
    

    respond_to do |format|
      if @comment.save
        str = 'コメントが投稿完了しました。' + @comment.user_id.to_s
        format.html{ redirect_to @comment, notice: str }
        format.json{ render :show, status: :created, location: @comment }
      else
        format.html{ render :new }
        format.json{ render json: @comment.errors, status: :unprocessable_entity }
      end
    end

  end


  def comment_params
    params.require(:comment).permit(:content, :user_id, :question_id)
  end


end
