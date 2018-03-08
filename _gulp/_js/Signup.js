

document.addEventListener( "DOMContentLoaded", function(){  

  new Signup();

} );


class Signup{

  constructor(){

  	this.nortice = document.querySelector( '.signup_container .notice' );

  	this.email = document.getElementById( 'user_email' );
  	this.password = document.getElementById( 'user_password' );
  	this.name = document.getElementById( 'user_name' );
  	this.subMitBtn = document.getElementsByClassName( 'submit_btn0' )[0];
  	this.subMitBtn.addEventListener( 'click', this.subMitBtnClickHandler.bind( this ) );

  }


  subMitBtnClickHandler( e ){

  	var errorMessage = '';

  	if( this.email.value == '' ) errorMessage += 'メールアドレスが入力されていません。<br>';
  	if( this.password.value == '' ) errorMessage += 'パスワードが入力されていません。<br>';
  	if( this.name.value == '' ) errorMessage += '名前が入力されていません。';

  	if( errorMessage != '' ){
  		this.nortice.innerHTML = errorMessage;
  		e.preventDefault();
  	}

  }


}