
export default class MainMenu{

  constructor(){
    
    this.element = document.getElementsByClassName( 'main_menu' )[0];
    this.closeBtn = this.element.getElementsByClassName( 'close_btn' )[0];
    this.closeBtn.addEventListener( 'click', this.closeBtnClickHandler.bind( this ) );
    this.bg = this.element.getElementsByClassName( 'bg' )[0];
    this.bg.addEventListener( 'click', this.closeBtnClickHandler.bind( this ) );

  }


  show(){

    this.element.style.transform = 'translateX(0px)';

  }


  hide(){

    this.element.style.transform = 'translateX(-750px)';

  }


  closeBtnClickHandler(){

    this.hide();

  }

}