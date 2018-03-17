class User < ApplicationRecord
	
	has_secure_password

	# メール送信時に使用する
	has_many :tokens
	

#引数に関連するユーザーが存在すればそれを返し、存在しまければ新規に作成する
  def self.find_or_create_from_auth_hash(auth_hash)
#OmniAuthで取得した各データを代入していく
    provider = auth_hash[:provider]
    uid = auth_hash[:uid]
    nickname = auth_hash[:info][:nickname]
    image_url = auth_hash[:info][:image]

    User.find_or_create_by(provider: provider, uid: uid) do |user|
      user.username = nickname
      user.photo = image_url
      user.provider = provider
      user.uid = uid
    end
  end
end
