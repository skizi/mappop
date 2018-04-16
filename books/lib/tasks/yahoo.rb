


module Yahoo extend self


  def get_map_data( keyword, min_lng, max_lng, min_lat, max_lat )

    limit = '100'
    bbox = min_lng.to_s + ',' + max_lat.to_s + ',' + max_lng.to_s + ',' + min_lat.to_s
    keyword = ERB::Util.url_encode( keyword )

    uri = 'https://map.yahooapis.jp/geocode/V1/geoCoder?appid=dj00aiZpPXZlUG0wM1Y2cFdyeiZzPWNvbnN1bWVyc2VjcmV0Jng9ZjA-&results=' + limit + '&bbox=' + bbox + '&output=json&query=' + keyword
    #uri = 'https://map.yahooapis.jp/search/local/V1/geoCoder?appid=dj00aiZpPXZlUG0wM1Y2cFdyeiZzPWNvbnN1bWVyc2VjcmV0Jng9ZjA-&gc=01&bbox=' + bbox + '&sort=score&results=' + limit + '&output=json'
    result = connectApi( uri )

    if result[ :message ] == 'success'
      
      array = result[ :result ][ 'Feature' ]
      activeRecord = []

      array.each_with_index do |value, i|

        photo = ''
        if value[ 'Property' ][ 'LeadImage' ]
          photo = value[ 'Property' ][ 'LeadImage' ]
        end

        latLng = value[ 'Geometry' ][ 'Coordinates' ].split( ',' )
        lat = latLng[1];
        lng = latLng[0];

        content = ''
        country = ''
        if value[ 'Property' ]
          content = value[ 'Property' ][ 'Address' ]
          country = value[ 'Property' ][ 'Country' ][ 'Name' ]
        end

        @question = Question.new()
        @question.user_id = 0
        @question.title = value[ 'Name' ]
        @question.content = content
        @question.lat = lat
        @question.lng = lng
        @question.photo = photo
        @question.country = country
        @question.state = ''
        @question.city = ''

        activeRecord.push( @question )

      end

      #activeRecord = Question.where(id: activeRecord.map{ |question| question.id })

      Question.import activeRecord

      #if activeRecord.save
        render plain: 'save comp!'
      #end
    end

  end


  def connectApi( uri )

    uri = URI.parse( uri )
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
        @message = 'success'
      
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

    return { result: @result, message: @message }

  end


  def question_params
    params.require(:question).permit(:title, :content, :lat, :lng, :user_id, :photo, :country, :state, :city, :cityRank )
  end

end