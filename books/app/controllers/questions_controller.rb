class QuestionsController < ApplicationController
  # layout 'questions'


  def index
  end


  def show
    @question = Question.find(params[:id])
  end


  def save
  	respond_to do |format|
  		if @question.update(question_params)
  			format.html{ redirect_to @question, notice: 'Question was successfully updated.' }
  		else
  			format.html{ render :edit }
  		end
  	end
  end


  def all
    @questions = Question.all
    respond_to do |format|
      format.html{ render :all }
      format.json{
        render json: @questions
      }
    end
  end


  def new
  	@question = Question.new
  	@question.user_id = params[:user_id]
  end


  def create

    if params
      @question = Question.new
      @question.title = params['title']
      @question.content = params['content']
      @question.lat = params['lat']
      @question.lng = params['lng']
      @question.user_id = params['user_id']
      # json_request = JSON.parse(request.body.read)
      # @question = Question.new(json_request)
    else
      @question = Question.new(question_params)
    end
  	
  	#render plain: @question.user_id.to_s + "!!!"
  	#return

  	respond_to do |format|
  		if @question.save
        str = '質問が投稿完了しました。' + @question.user_id.to_s
  			format.html{ redirect_to @question, notice: str }
  		  format.json{ render :show, status: :created, location: @question }
      else
  			format.html{ render :new }
        format.json{ render json: @question.errors, status: :unprocessable_entity }
      end
  	end

  end


  def question_params
    params.require(:question).permit(:title, :content, :lat, :lng, :user_id)
  end
end
