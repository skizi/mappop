class MappopMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.mappop_mailer.send_when_update.subject
  #
  def send_when_update( user, token )
  	@user = user
  	@token = token
    mail to: user.email,
    	subject: 'MapPop 会員登録'
  end
end
