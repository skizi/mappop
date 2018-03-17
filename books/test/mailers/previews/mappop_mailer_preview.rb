# Preview all emails at http://localhost:3000/rails/mailers/mappop_mailer
class MappopMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/mappop_mailer/send_when_update
  def send_when_update
    MappopMailer.send_when_update
  end

end
