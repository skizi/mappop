import MainMenu from './MainMenu';
import UserAgent from './UserAgent';
import Util from './Util';


document.addEventListener( "DOMContentLoaded", function(){	
  new Common();
} );

class Common{

  constructor(){

  	Util.ua = new UserAgent();

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

	if( Util.ua.platform == 'sp' ){
		var wrapper = document.getElementsByClassName( 'wrapper' )[0];
		wrapper.style.zoom = window.innerWidth / 375;
	}

  }


  mainMenuBtnClickHandler(){

  	this.mainMenu.show();

  }
}
