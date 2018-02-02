
export default class Modal{

  constructor( expr ){

  	this.element = document.querySelector( expr );
  	this.closeBtn = document.querySelector( expr + ' .close_btn' );
  	this.closeBtn.addEventListener( 'click', this.hide.bind( this ) );
  	this.hide();

  }


  show(){

  	this.element.style.display = 'block';

  }


  hide(){

  	this.element.style.display = 'none';

  }

}
