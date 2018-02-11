
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

  }


  editPhotoBtnClickHandler(){

  	this.editProfileModal.type = 'photo';
  	this.editProfileModal.show();

  }


  editBtnClickHandler(){

  	this.editProfileModal.type = 'profile';
  	this.editProfileModal.show();

  }
}
