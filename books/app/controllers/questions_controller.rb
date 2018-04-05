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


  def get_k_cloud

    limit = params['limit']
    # coordinates = params['lng'].to_s + ',' + params['lat'].to_s + ',' + params['dist'].to_s
    place = ERB::Util.url_encode(params['place'].to_s)
    
    #categorys = [ '山岳','高原','湖沼','河川景観','海岸景観','海中公園','その他（特殊地形）','自然現象','町並み','郷土景観','展望施設','公園','庭園','動物','植物','城郭','旧街道','史跡','歴史的建造物','近代的建造物','博物館','美術館','動・植物園','水族館','産業観光施設','道の駅（見る）','神社・仏閣等','地域風俗','その他 アニメ・音楽舞台','映画・ドラマロケ地','その他（名所）','行事・祭事','花見','花火大会','イベント鑑賞 郷土芸能','その他（イベント）','文化施設 センター施設','道の駅（遊ぶ）','スポーツ・リゾート施設','サイクリングセンター','キャンプ場','フィールド・アスレチック','フィールド・アーチェリー場','スケート場','スキー場','マリーナ・ヨットハーバー','サイクリングコース','ハイキングコース','自然歩道・自然研究路','オリエンテーリング・パーマネントコース','海水浴場','観光農林業（体験含む）','観光牧場（体験含む）','観光漁業（体験含む）','テーマパーク・レジャーランド','温泉 温泉','その他 その他（遊ぶ）','名産品 ショッピング店','伝統工芸技術','その他（買う）','郷土料理店 郷土料理店','その他（食べる）','観光タクシー・ハイヤー・レンタカー','ケーブルカー・ロープウェイ','レンタサイクル','遊覧船','遊覧飛行機','観光列車','観光周遊バス','その他（乗り物）']
    # categorys = '山岳;高原;湖沼;河川景観;海岸景観;海中公園;その他（特殊地形）;自然現象;町並み;郷土景観;展望施設;公園;庭園;動物;植物;城郭;旧街道;史跡;歴史的建造物;近代的建造物;博物館;美術館;動・植物園;水族館;産業観光施設;道の駅（見る）;神社・仏閣等;地域風俗;その他 アニメ・音楽舞台;映画・ドラマロケ地;その他（名所）;行事・祭事;花見;花火大会;イベント鑑賞 郷土芸能;その他（イベント）;文化施設 センター施設;道の駅（遊ぶ）;スポーツ・リゾート施設;サイクリングセンター;キャンプ場;フィールド・アスレチック;フィールド・アーチェリー場;スケート場;スキー場;マリーナ・ヨットハーバー;サイクリングコース;ハイキングコース;自然歩道・自然研究路;オリエンテーリング・パーマネントコース;海水浴場;観光農林業（体験含む）;観光牧場（体験含む）;観光漁業（体験含む）;テーマパーク・レジャーランド;温泉 温泉;その他 その他（遊ぶ）;名産品 ショッピング店;伝統工芸技術;その他（買う）;郷土料理店 郷土料理店;その他（食べる）;観光タクシー・ハイヤー・レンタカー;ケーブルカー・ロープウェイ;レンタサイクル;遊覧船;遊覧飛行機;観光列車;観光周遊バス;その他（乗り物）'
    # place = ERB::Util.url_encode('東京都')
    categorys = '%e5%b1%b1%e5%b2%b3%3b%e9%ab%98%e5%8e%9f%3b%e6%b9%96%e6%b2%bc%3b%e6%b2%b3%e5%b7%9d%e6%99%af%e8%a6%b3%3b%e6%b5%b7%e5%b2%b8%e6%99%af%e8%a6%b3%3b%e6%b5%b7%e4%b8%ad%e5%85%ac%e5%9c%92%3b%e3%81%9d%e3%81%ae%e4%bb%96%ef%bc%88%e7%89%b9%e6%ae%8a%e5%9c%b0%e5%bd%a2%ef%bc%89%3b%e8%87%aa%e7%84%b6%e7%8f%be%e8%b1%a1%3b%e7%94%ba%e4%b8%a6%e3%81%bf%3b%e9%83%b7%e5%9c%9f%e6%99%af%e8%a6%b3%3b%e5%b1%95%e6%9c%9b%e6%96%bd%e8%a8%ad%3b%e5%85%ac%e5%9c%92%3b%e5%ba%ad%e5%9c%92%3b%e5%8b%95%e7%89%a9%3b%e6%a4%8d%e7%89%a9%3b%e5%9f%8e%e9%83%ad%3b%e6%97%a7%e8%a1%97%e9%81%93%3b%e5%8f%b2%e8%b7%a1%3b%e6%ad%b4%e5%8f%b2%e7%9a%84%e5%bb%ba%e9%80%a0%e7%89%a9%3b%e8%bf%91%e4%bb%a3%e7%9a%84%e5%bb%ba%e9%80%a0%e7%89%a9%3b%e5%8d%9a%e7%89%a9%e9%a4%a8%3b%e7%be%8e%e8%a1%93%e9%a4%a8%3b%e5%8b%95%e3%83%bb%e6%a4%8d%e7%89%a9%e5%9c%92%3b%e6%b0%b4%e6%97%8f%e9%a4%a8%3b%e7%94%a3%e6%a5%ad%e8%a6%b3%e5%85%89%e6%96%bd%e8%a8%ad%3b%e9%81%93%e3%81%ae%e9%a7%85%ef%bc%88%e8%a6%8b%e3%82%8b%ef%bc%89%3b%e7%a5%9e%e7%a4%be%e3%83%bb%e4%bb%8f%e9%96%a3%e7%ad%89%3b%e5%9c%b0%e5%9f%9f%e9%a2%a8%e4%bf%97%3b%e3%81%9d%e3%81%ae%e4%bb%96%20%e3%82%a2%e3%83%8b%e3%83%a1%e3%83%bb%e9%9f%b3%e6%a5%bd%e8%88%9e%e5%8f%b0%3b%e6%98%a0%e7%94%bb%e3%83%bb%e3%83%89%e3%83%a9%e3%83%9e%e3%83%ad%e3%82%b1%e5%9c%b0%3b%e3%81%9d%e3%81%ae%e4%bb%96%ef%bc%88%e5%90%8d%e6%89%80%ef%bc%89%3b%e8%a1%8c%e4%ba%8b%e3%83%bb%e7%a5%ad%e4%ba%8b%3b%e8%8a%b1%e8%a6%8b%3b%e8%8a%b1%e7%81%ab%e5%a4%a7%e4%bc%9a%3b%e3%82%a4%e3%83%99%e3%83%b3%e3%83%88%e9%91%91%e8%b3%9e%20%e9%83%b7%e5%9c%9f%e8%8a%b8%e8%83%bd%3b%e3%81%9d%e3%81%ae%e4%bb%96%ef%bc%88%e3%82%a4%e3%83%99%e3%83%b3%e3%83%88%ef%bc%89%3b%e6%96%87%e5%8c%96%e6%96%bd%e8%a8%ad%20%e3%82%bb%e3%83%b3%e3%82%bf%e3%83%bc%e6%96%bd%e8%a8%ad%3b%e9%81%93%e3%81%ae%e9%a7%85%ef%bc%88%e9%81%8a%e3%81%b6%ef%bc%89%3b%e3%82%b9%e3%83%9d%e3%83%bc%e3%83%84%e3%83%bb%e3%83%aa%e3%82%be%e3%83%bc%e3%83%88%e6%96%bd%e8%a8%ad%3b%e3%82%b5%e3%82%a4%e3%82%af%e3%83%aa%e3%83%b3%e3%82%b0%e3%82%bb%e3%83%b3%e3%82%bf%e3%83%bc%3b%e3%82%ad%e3%83%a3%e3%83%b3%e3%83%97%e5%a0%b4%3b%e3%83%95%e3%82%a3%e3%83%bc%e3%83%ab%e3%83%89%e3%83%bb%e3%82%a2%e3%82%b9%e3%83%ac%e3%83%81%e3%83%83%e3%82%af%3b%e3%83%95%e3%82%a3%e3%83%bc%e3%83%ab%e3%83%89%e3%83%bb%e3%82%a2%e3%83%bc%e3%83%81%e3%82%a7%e3%83%aa%e3%83%bc%e5%a0%b4%3b%e3%82%b9%e3%82%b1%e3%83%bc%e3%83%88%e5%a0%b4%3b%e3%82%b9%e3%82%ad%e3%83%bc%e5%a0%b4%3b%e3%83%9e%e3%83%aa%e3%83%bc%e3%83%8a%e3%83%bb%e3%83%a8%e3%83%83%e3%83%88%e3%83%8f%e3%83%bc%e3%83%90%e3%83%bc%3b%e3%82%b5%e3%82%a4%e3%82%af%e3%83%aa%e3%83%b3%e3%82%b0%e3%82%b3%e3%83%bc%e3%82%b9%3b%e3%83%8f%e3%82%a4%e3%82%ad%e3%83%b3%e3%82%b0%e3%82%b3%e3%83%bc%e3%82%b9%3b%e8%87%aa%e7%84%b6%e6%ad%a9%e9%81%93%e3%83%bb%e8%87%aa%e7%84%b6%e7%a0%94%e7%a9%b6%e8%b7%af%3b%e3%82%aa%e3%83%aa%e3%82%a8%e3%83%b3%e3%83%86%e3%83%bc%e3%83%aa%e3%83%b3%e3%82%b0%e3%83%bb%e3%83%91%e3%83%bc%e3%83%9e%e3%83%8d%e3%83%b3%e3%83%88%e3%82%b3%e3%83%bc%e3%82%b9%3b%e6%b5%b7%e6%b0%b4%e6%b5%b4%e5%a0%b4%3b%e8%a6%b3%e5%85%89%e8%be%b2%e6%9e%97%e6%a5%ad%ef%bc%88%e4%bd%93%e9%a8%93%e5%90%ab%e3%82%80%ef%bc%89%3b%e8%a6%b3%e5%85%89%e7%89%a7%e5%a0%b4%ef%bc%88%e4%bd%93%e9%a8%93%e5%90%ab%e3%82%80%ef%bc%89%3b%e8%a6%b3%e5%85%89%e6%bc%81%e6%a5%ad%ef%bc%88%e4%bd%93%e9%a8%93%e5%90%ab%e3%82%80%ef%bc%89%3b%e3%83%86%e3%83%bc%e3%83%9e%e3%83%91%e3%83%bc%e3%82%af%e3%83%bb%e3%83%ac%e3%82%b8%e3%83%a3%e3%83%bc%e3%83%a9%e3%83%b3%e3%83%89%3b%e6%b8%a9%e6%b3%89%20%e6%b8%a9%e6%b3%89%3b%e3%81%9d%e3%81%ae%e4%bb%96%20%e3%81%9d%e3%81%ae%e4%bb%96%ef%bc%88%e9%81%8a%e3%81%b6%ef%bc%89%3b%e5%90%8d%e7%94%a3%e5%93%81%20%e3%82%b7%e3%83%a7%e3%83%83%e3%83%94%e3%83%b3%e3%82%b0%e5%ba%97%3b%e4%bc%9d%e7%b5%b1%e5%b7%a5%e8%8a%b8%e6%8a%80%e8%a1%93%3b%e3%81%9d%e3%81%ae%e4%bb%96%ef%bc%88%e8%b2%b7%e3%81%86%ef%bc%89%3b%e9%83%b7%e5%9c%9f%e6%96%99%e7%90%86%e5%ba%97%20%e9%83%b7%e5%9c%9f%e6%96%99%e7%90%86%e5%ba%97%3b%e3%81%9d%e3%81%ae%e4%bb%96%ef%bc%88%e9%a3%9f%e3%81%b9%e3%82%8b%ef%bc%89%3b%e8%a6%b3%e5%85%89%e3%82%bf%e3%82%af%e3%82%b7%e3%83%bc%e3%83%bb%e3%83%8f%e3%82%a4%e3%83%a4%e3%83%bc%e3%83%bb%e3%83%ac%e3%83%b3%e3%82%bf%e3%82%ab%e3%83%bc%3b%e3%82%b1%e3%83%bc%e3%83%96%e3%83%ab%e3%82%ab%e3%83%bc%e3%83%bb%e3%83%ad%e3%83%bc%e3%83%97%e3%82%a6%e3%82%a7%e3%82%a4%3b%e3%83%ac%e3%83%b3%e3%82%bf%e3%82%b5%e3%82%a4%e3%82%af%e3%83%ab%3b%e9%81%8a%e8%a6%a7%e8%88%b9%3b%e9%81%8a%e8%a6%a7%e9%a3%9b%e8%a1%8c%e6%a9%9f%3b%e8%a6%b3%e5%85%89%e5%88%97%e8%bb%8a%3b%e8%a6%b3%e5%85%89%e5%91%a8%e9%81%8a%e3%83%90%e3%82%b9%3b%e3%81%9d%e3%81%ae%e4%bb%96%ef%bc%88%e4%b9%97%e3%82%8a%e7%89%a9%ef%bc%89'

    # limit = '10'
    # coordinates = '139.6917064,35.6894875,40000'
    uri = URI.parse( 'https://www.chiikinogennki.soumu.go.jp/k-cloud-api/v001/kanko/' + categorys + '/json?limit=' + limit + '&place=' + place )# '&coordinates=' + coordinates )
    @query = uri.query


    response = Net::HTTP.new( uri.host, uri.port ) 
    response.use_ssl = true
    response = response.start() do |http|
      # 接続時に待つ最大秒数を設定
      http.open_timeout = 5
      # 読み込み一回でブロックして良い最大秒数を設定
      http.read_timeout = 10
      # ここでWebAPIを叩いている
      # Net::HTTPResponseのインスタンスが返ってくる
      http.get(uri.request_uri)
    end


    begin

      case response
      
      when Net::HTTPSuccess
        # responseのbody要素をJSON形式で解釈し、hashに変換
        @result = JSON.parse(response.body)
        render json: @result, status: :ok
        return
      
      when Net::HTTPRedirection
        @message = "Redirection: code=#{response.code} message=#{response.message}"
      # その他エラー
      else
        @message = "HTTP ERROR: code=#{response.code} message=#{response.message}"
      end

    # エラー時処理
    rescue IOError => e
      @message = "e.message"
    rescue TimeoutError => e
      @message = "e.message"
    rescue JSON::ParserError => e
      @message = "e.message"
    rescue => e
      @message = "e.message"
    end

    render json: {status: :ng, code: 500, content: {message: @message }}

  end


  def question_params
    params.require(:question).permit(:title, :content, :lat, :lng, :user_id, :photo, :country, :state, :city, :cityRank )
  end
end
