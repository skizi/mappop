
import EditProfileModal from './EditProfileModal';



document.addEventListener( "DOMContentLoaded", function(){	

  new Profile();

} );


class Profile{

  constructor(){

  	this.editPhotoBtn = document.querySelector( '.photo_container .photo' );
  	this.editPhotoBtn.addEventListener( 'click', this.editPhotoBtnClickHandler.bind( this ) );

  	this.editBtn = document.getElementsByClassName( 'edit_profile_btn' )[0];
  	this.editBtn.addEventListener( 'click', this.editBtnClickHandler.bind( this ) );
  	this.editProfileModal = new EditProfileModal();

  	this.about = document.querySelector( '.main_content p.about' );
  	this.adjustAboutText();

  }


  editPhotoBtnClickHandler(){

  	this.editProfileModal.type = 'photo';
  	this.editProfileModal.show();

  }


  editBtnClickHandler(){

  	this.editProfileModal.type = 'profile';
  	this.editProfileModal.show();

  }


  //プロフィール文の整形
  //一行18文字以内、各行をspanで囲む
  adjustAboutText(){
  	
  	//改行が３回以上の場合は３行目に全て連結する
  	var strs = this.about.innerHTML.split( '\n' );
  	if( !strs[1] ) strs[1] = '';
  	if( !strs[2] ) strs[2] = '';
  	if( strs.length > 3 ){
	  	for( var i = 3; i < strs.length; i++ ){
	  		strs[2] += strs[i];
  		}
  	}

  	//一行に18文字以上の場合は次の行に加える
  	var cacheStr = '';
  	for( var i = 0; i < 3; i++ ){
  		strs[i] = cacheStr + strs[i];
  		if( strs[i].length > 18 && i != 2 ){
  			cacheStr = strs[i];
  			cacheStr = cacheStr.slice( 17 );
  			strs[i] = strs[i].slice( 0, 17 );
  		}
  	}


  	//一行に18文字以上の場合は前の行に加える
  	cacheStr = '';
  	for( i = 2; i > -1; i-- ){
  		strs[i] = strs[i] + cacheStr;
  		if( strs[i].length > 18 ){
  			cacheStr = strs[i];
  			cacheStr = cacheStr.slice( 0, strs[i].length - 18 );
  			strs[i] = strs[i].slice( strs[i].length - 18 );
  		}
  	}

  	//文字を改行ごとにspanで囲む
  	var html = '';
  	for( var i = 0; i < 3; i++ ){
	  	var str = '<span>' + strs[i] + '</span>';
  		if( i != 2 ) str = str + '<br>';
  		html += str;
  	}
  	this.about.innerHTML = html;

  }

}
