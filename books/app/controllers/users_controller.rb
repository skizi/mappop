class UsersController < ApplicationController
  

  def index
    @users = User.all
  end

  def show
  	@user = User.find( params[:id] )

    @img_paths = []
    jpgs = Dir.glob(Rails.root.join('public', '*.jpg'))
    jpgs.each do |png|
      @img_paths.push('/'+File.basename(png))
    end
    #@user = User.find_by( :username => params[:username] )
  end


  def new
    @user = User.new
    if params[:provider].nil?
      session.delete(:provider)
      session.delete(:uid)
    end
  end


  def all
    @users = User.all
  end


  def create
    # @user = User.new(user_params)
    tmp_user = User.find_by_email(user_params[:email])

    # if !User.find_by(:email => @user.email).nil?
    #   flash.now[:notice] = 'そのメールアドレスはすでに登録されています。'
    #   render :new
    #   return
    # end


    # ユーザ作成済み
    if tmp_user && tmp_user.created
      
      flash.alert = "入力されたメールアドレスは登録済みです。"
      redirect_to controller: 'sessions', action: 'new'
   
    # ユーザは既にあるが、本登録していない。一度トークンを全て使えなくする（するならhas_oneで上書く方がいいかもしれないが）
    elsif tmp_user
    
      @user = tmp_user
      Token.all.each do |token|
        # 有効期限を変更する
        token.update_attributes!(expired_at: Time.now)
      end
      # 新しいトークン生成
      @token = SecureRandom.uuid
      # 有効期限は２４時間
      @user.tokens.create!(uuid: @token, expired_at: 24.hours.since)
      # メール通知(ActionMailer)
      @mail = MappopMailer.send_when_update(@user,@token).deliver
      # @mail = TestMailer.user_create_mail(@user,@token).deliver
      # 仮登録成功ページヘ
      redirect_to :action => 'tmp'
    
    else
    
      @user = User.new(user_params)
      @user.created = false

      # バリデート
      if @user.email.empty?
        flash.now[:notice] = 'メールアドレスの記入は必須です。'
        render :new
        return
      end

      if @user.password.nil?
        flash.now[:notice] = 'パスワードの記入は必須です。'
        render :new
        return
      end

      # SNSのIDでの登録の場合はuidとproviderを保存
      if !session[:provider].nil?
        @user.uid = session[:uid]
        @user.provider = session[:provider]
      end

      # 画像は最初はNoImageを登録
      @user[:photo] = "docs/user_icon/no_image.jpg"
    
      # ユーザーデータ保存
      if @user.save
        # トークン生成
        @token = SecureRandom.uuid
        @user.tokens.create!(uuid: @token, expired_at: 24.hours.since)
        # メール通知
        # @mail = TestMailer.user_create_mail(@user,@token).deliver
        @mail = MappopMailer.send_when_update(@user,@token).deliver
        redirect_to :action => 'tmp'
      else
        render 'new'
      end
    end


    # respond_to do |format|
    #   if @user.save
    #     log_in @user
    #     format.html { redirect_to @user, notice: 'User was successfully created.' }
    #     format.json { render :show, status: :created, location: @user }
    #   else
    #     format.html { render :new }
    #     format.json { render json: @user.errors, status: :unprocessable_entity }
    #   end
    # end
  end


  def tmp
  end


  def token
    # 有効期限の確認
    token = Token.find_by_uuid!(params[:uuid])
    # 有効期限を過ぎていないか確認
    if token && token.expired_at > Time.now
      # ２回目アクセスできないように更新
      token.update_attributes!(expired_at: Time.now)
      @user = token.user
      @user.update_attributes!(created: true)
      # 登録完了メール通知
      flash.now.alert = "本登録が完了しました"
      # @mail = TestMailer.user_complete_mail(@user).deliver
      # @mail = MappopMailer.user_complete_mail(@user).deliver
      # ログイン画面へ
      # redirect_to :login
      log_in @user
      format.html { redirect_to @user, notice: 'User was successfully created.' }
      format.json { render :show, status: :created, location: @user }
    else
      # トークンがない、もしくは２回目のアクセス -> 失敗を通知、ユーザ登録ページのリンクを貼る
      if token && token.user.created
        redirect_to :login, alert: "入力されたメールアドレスは本登録が完了しています。"
      else
        redirect_to :action => 'new', alert: "仮登録の有効期限が切れている。もしくは、URLが適切ではありません。"
      end
    end
  end


  def edit
    @user = User.find(params[:id])
  end



  def update
    @user = User.find(params[:id])
    
    respond_to do |format|
      if @user.update(user_params)
        format.html{ redirect_to @user, notice: 'user was successfully updated.' }
      else
        format.html{ render :show }
      end
    end
  end
  # def update
  #   @user = User.find(params[:id])
  #   # @user = User.new(user_params)
  #   # @user = User.find( params[:id] ) 
  #   # @user.photo = params[:photo]

  #   respond_to do |format|
  #     if @user.update(user_params)
  #       format.html { redirect_to @user, notice: 'User was successfully created.' }
  #       format.json { render :show, status: :created, location: @user }
  #     else
  #       format.html { render :show }
  #       format.json { render json: @user.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end


  def upload
  end


  def upload_process
    file = params[:upfile]
    # name = file.original_filename
    name = params[:id].to_s + '.' + file.original_filename.split('.')[1]
    perms = ['.jpg', '.jpeg', '.gif', '.png']

    if !perms.include?( File.extname( name ).downcase )
      result = 'アップロードできるのは画像ファイルのみです'
    elsif file.size > 1.megabyte
      result = 'ファイルサイズは1MBまでです。'
    else 
      File.open(Rails.root.to_s+"/public/docs/user_icon/#{name}", 'wb') { |f| f.write(file.read) }
      result = "#{name}をアップロードしました。"
    end


    user = User.find(params[:id])
    user.photo = "docs/user_icon/#{name}"
    user.save

    #render :json => tweet
    #render plain: result
    redirect_to '/users/' + params[:id].to_s
    #render plain: "id:" + params[:id]
  end
  

  def user_params
    params.require(:user).permit(:name, :username, :location, :about, :email, :password, :photo, :provider, :uid)
  end

end
