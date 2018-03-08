

document.addEventListener( "DOMContentLoaded", function(){  

  new Login();

} );


class Login{

  constructor(){

  	this.nortice = document.querySelector( '.signup_container .notice' );

  	this.email = document.getElementById( 'session_email' );
  	this.password = document.getElementById( 'session_password' );
  	this.subMitBtn = document.getElementsByClassName( 'submit_btn0' )[0];
  	this.subMitBtn.addEventListener( 'click', this.subMitBtnClickHandler.bind( this ) );

  }


  subMitBtnClickHandler( e ){

  	var errorMessage = '';

  	if( this.email.value == '' ) errorMessage += 'メールアドレスが入力されていません。<br>';
  	if( this.password.value == '' ) errorMessage += 'パスワードが入力されていません。<br>';

  	if( errorMessage != '' ){
  		this.nortice.innerHTML = errorMessage;
  		e.preventDefault();
  	}

  }


}