import MainMenu from './MainMenu';

document.addEventListener( "DOMContentLoaded", function(){	
  new Common();
} );

class Common{

  constructor(){

  	this.mainMenuBtn = document.getElementsByClassName( 'main_menu_btn' )[0];
  	this.mainMenuBtn.addEventListener( 'click', this.mainMenuBtnClickHandler.bind( this ) );
  	this.mainMenu = new MainMenu();
	
	//拡大禁止
	// var inputs = document.getElementsByTagName( 'input' );
	// for( var i = 0; i < inputs.length; i++ ){
	// 	if( inputs[i].getAttribute( 'type' ) == 'text' ){
	// 		inputs[i].addEventListener('touchstart', event => {
	// 			event.preventDefault();
	// 		}, false);
	// 	}
	// }

	// var textareas = document.getElementsByTagName( 'textarea' );
	// for( var i = 0; i < textareas.length; i++ ){
	// 	textareas[i].addEventListener('touchstart', event => {
	// 		event.preventDefault();
	// 	}, false);
	// }

  }


  mainMenuBtnClickHandler(){

  	this.mainMenu.show();

  }
}
