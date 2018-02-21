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
  end


  def all
    @users = User.all
  end


  def create
    @user = User.new(user_params)
    @user[:photo] = "docs/user_icon/no_image.jpg"

    respond_to do |format|
      if @user.save
        log_in @user
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
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
    params.require(:user).permit(:name, :username, :location, :about, :email, :password, :photo)
  end

end
