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
    # @questions = Question.all
    @questions = Question.includes([ :comments, :likes ]).all
    respond_to do |format|
      format.html{ render :all }
      format.json{ render json: @questions.to_json(:include => [ :comments, :likes ] ) }
    end
  end


  def new
  	@question = Question.new
  	@question.user_id = params[:user_id]
  end


  def create

    if params['title']
      # 一度saveするかQuestion.createじゃないと
      # @question[:id]が作られない
      @question = Question.create(
        title: params['title'],
        content: params['content'],
        lat: params['lat'],
        lng: params['lng'],
        user_id: params['user_id']
      )

      #画像があれば保存
      if params['upfile']
        file = params['upfile']
        name = @question[:id].to_s + '.' + file.original_filename.split('.')[1]

        perms = ['.jpg', '.jpeg', '.gif', '.png']
        if !perms.include?( File.extname( name ).downcase )
          result = 'アップロードできるのは画像ファイルのみです'
        elsif file.size > 1.megabyte
          result = 'ファイルサイズは1MBまでです。'
        else 
          File.open("public/docs/question_photo/#{name}", 'w') { |f| f.write(file.read) }
          result = "#{name}をアップロードしました。"
          @question.photo = "docs/question_photo/#{name}"
        end
      end

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
    params.require(:question).permit(:title, :content, :lat, :lng, :user_id, :photo)
  end
end
