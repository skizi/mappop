class TweetsController < ApplicationController
  before_action :set_tweet, only: [:detail, :show, :edit, :update, :upload]
  # POST /tweets
  #最高何記事表示するか
  PER = 5

  def index
    @tweets = Tweet.page(params[:page]).per(PER)
  	#@tweets = Tweet.all
  end

  def detail
  end

  def show
  end

  def new
  	@tweet = Tweet.new
  end

  def edit
  end

  def create
  	@tweet = Tweet.new(tweet_params)

  	#@tweet.title = params[:tweet][:title]
  	#@tweet.content = params[:tweet][:content]
  	#@tweet.save
  	#redirect_to '/tweets/index'

  	respond_to do |format|
  		if @tweet.save
  			format.html{ redirect_to @tweet, notice: 'Tweet was successfully created.' }
  		else
  			format.html{ render :new }
  		end
  	end
  end

  def update
  	respond_to do |format|
  		if @tweet.update(tweet_params)
  			format.html{ redirect_to @tweet, notice: 'Tweet was successfully updated.' }
  		else
  			format.html{ render :edit }
  		end
  	end
  end

  def upload
  end

  def upload_process
    file = params[:upfile]
    name = file.original_filename
    perms = ['.jpg', '.jpeg', '.gif', '.png']

    if !perms.include?( File.extname( name ).downcase )
      result = 'アップロードできるのは画像ファイルのみです'
    elsif file.size > 1.megabyte
      result = 'ファイルサイズは1MBまでです。'
    else 
      File.open("public/docs/#{name}", 'wb') { |f| f.write(file.read) }
      result = "#{name}をアップロードしました。"
    end


    tweet = Tweet.find(params[:id])
    tweet.photo_url = "docs/#{name}"
    tweet.save

    #render :json => tweet
    #render plain: result
    redirect_to '/tweets/' + params[:id].to_s
    #render plain: "id:" + params[:id]
  end

  private
	def set_tweet
		@tweet = Tweet.find(params[:id])
	end

	def tweet_params
		#logger.debug params;
		params.require(:tweet).permit(:title, :content)
  		#params.permit(:title, :content)
  		#Tweet.find_by(:id => params[:id])
	end
end
