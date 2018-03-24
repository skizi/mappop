class QuestionsController < ApplicationController
  # layout 'questions'


  def index
  end


  def show
    @question = Question.find(params['id'])
    respond_to do |format|
      format.html{ render :show }
      format.json{ render json: @question.to_json(:include => [ :comments, :likes ] ), status: :ok }
    end
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
    #@questions = Question.all
    @questions = Question.includes([ :comments, :likes ]).all
    respond_to do |format|
      format.html{ render :all }
      format.json{ render json: @questions.to_json(:include => [ :comments, :likes ] ), status: :ok }
    end
  end


  def search_lat_lng

    #緯度は画面から見て、縦は上が大きい値、下が小さい値となる
    latRange = Range.new( params['max_lat'].to_f, params['min_lat'].to_f )
    lngRange = Range.new( params['min_lng'].to_f, params['max_lng'].to_f )
    @questions = Question.where( lat: latRange, lng: lngRange )

    # 配列ソート後 takeで先頭のlimit数分取得する
    @questions = @questions.sort { |a, b| b.likes.count <=> a.likes.count }
    @questions = @questions.take( params['limit'].to_i )

    
    respond_to do |format|
      format.html{ render :all }
      format.json{ render json: @questions.to_json(:include => [ :comments, :likes ] ), status: :ok }
    end

  end


  def __get_ranking

    ranks = Like.group(:question_id).order('count(question_id) desc').limit(3).pluck(:question_id)
    # @questions = Question.eager_load(:likes).order( "likes.question_id" )
    @questions = Question.where( city: params['key'], id: ranks );

# hoge = 0
# @questions.each do |question|
#   hoge += question.likes.count
# end
# render plain: ranks
# return;

# @questions.sort { |x, y|
#    x.likes.size <=> y.likes.size
# }

@questions = @questions.sort { |a, b| b.likes.count <=> a.likes.count }
#render plain: Like.group(:question_id).order('count(question_id) desc').limit(5).pluck(:question_id)

    respond_to do |format|
      format.html{ render :all }
      format.json{ render json: @questions.to_json(:include => [ :comments, :likes ] ), status: :ok }
    end
  end


  def refresh_ranking

    refresh_ranking_step2( 'country' )
    refresh_ranking_step2( 'state' )
    cities = refresh_ranking_step2( 'city' )

    @questions = cities[ 'undefined' ] #cityがundefinedのものを参照
 
    # render plain: cities2[ cities2.length()-2 ]
    # render plain: cities[ '東京' ]
    # return

    # respond_to do |format|
    #   format.html{ render :all }
    #   format.json{ render json: @questions.to_json(:include => [ :comments, :likes ] ), status: :ok }
    # end

    render plain: 'ranking refresh complete!'
  end


  def refresh_ranking_step2( type )

    rankName = 'city_rank'
    if type == 'country' then
      rankName = 'country_rank'
    elsif type == 'state' then
      rankName = 'state_rank'
    end

    @questions = Question.includes([ :likes ]).all
    caches = {}
    for q in @questions do

      # まだ精査していない（ハッシュに存在しない）市区のみ参照する
      name = q[ type ]
      if !caches.include?( name )

        caches[ name ] = Question.where( type + " = '" + name.to_s + "'" )
        caches[ name ] = caches[ name ].sort { |a, b| b.likes.count <=> a.likes.count }
        
        rank = 0
        ranks = {}
        for _q in caches[ name ] do
          _q[ rankName ] = rank
          ranks[ _q.id ] = { rankName => rank }
          rank += 1 
        end

        # .sortをかけると配列になってしまうので、
        # ActiveRecordに変換するためにwhereする。
        activeRecord = Question.where(id: caches[ name ].map{ |question| question.id })

        # データベース更新
        activeRecord.update( ranks.keys, ranks.values )

      end

    end


    return caches

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
        user_id: params['user_id'],
        country: params['country'],
        state: params['state'],
        city: params['city']
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
          File.open(Rails.root.to_s+"/public/docs/question_photo/#{name}", 'wb') { |f| f.write(file.read) }
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
  		  format.json{ render :show, status: :ok, location: @question }
      else
  			format.html{ render :new }
        format.json{ render json: @question.errors, status: :unprocessable_entity }
      end
  	end

  end


  def question_params
    params.require(:question).permit(:title, :content, :lat, :lng, :user_id, :photo, :country, :state, :city, :cityRank )
  end
end
