import MainMenu from './MainMenu';

document.addEventListener( "DOMContentLoaded", function(){	
  new Common();
} );

class Common{

  constructor(){

  	this.mainMenuBtn = document.getElementsByClassName( 'main_menu_btn' )[0];
  	this.mainMenuBtn.addEventListener( 'click', this.mainMenuBtnClickHandler.bind( this ) );
  	this.mainMenu = new MainMenu();

  }


  mainMenuBtnClickHandler(){

  	this.mainMenu.show();

  }
}
