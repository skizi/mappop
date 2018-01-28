class SessionsController < ApplicationController
  include SessionsHelper

  def new
  end

  def create

  	#downcase：大文字を小文字に変換してくれる
    user = User.find_by(email: params[:session][:email].downcase)
    #user = User.find_by(:email => params[:session][:email])#.downcase

  	#render plain: user.password_digest.to_s + "!!!"
  	#render plain: user.authenticate( params[:session][:password] ).to_s
  	#return

    if user && user.password_digest && user.authenticate( params[:session][:password] ) then
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


  def destroy
  	log_out
  	redirect_to root_url
  end

end
