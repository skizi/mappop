class SessionsController < ApplicationController
  include SessionsHelper

  def new
  end

  def create
    if !params[:session]
      render 'new'
      return
    end

  	#downcase：大文字を小文字に変換してくれる
    user = User.find_by(email: params[:session][:email].downcase)
    #user = User.find_by(:email => params[:session][:email])#.downcase

  	# render plain: user.password_digest.to_s + '!!!"
  	# render plain: user.authenticate( params[:session][:password] ).to_s
  	# return

    if user && user.password_digest && user.authenticate( params[:session][:password] )
    	#authenticateメソッド：引数の文字列がパスワードと一致するとUserオブジェクトを、間違っているとfalse返すメソッド
    	#reset_session
    	#session[:user_id] = user.id
    	log_in user
    	redirect_to user
    	#redirect_to params[:referer]
    else
      flash.now[:danger] = 'emailもしくはパスワードが間違っています'
      render 'new'
    end
  end


  def createTwitter
    user = User.find_or_create_from_auth_hash(request.env['omniauth.auth'])
# request.env['omniauth.auth']に、OmniAuthによってHashのようにユーザーのデータが格納されている。

    _user = Question.where( provider: user.provider, uid: user.uid );
    if _user.nil?
      session[:uid] = user.uid
      session[:provider] = user.provider
      redirect_to controller: 'users', action: 'new', provider: 'twitter'
    else
      log_in user
      redirect_to user
    end

  end


  def destroy
  	log_out if logged_in?
  	redirect_to root_url
  end

end
