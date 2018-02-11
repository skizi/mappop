
export default class Modal{

  constructor( expr ){

  	this.element = document.querySelector( expr );
  	this.inner = this.element.getElementsByClassName( 'inner' )[0];
  	this.bg = this.element.getElementsByClassName( 'bg' )[0];
  	this.bg.addEventListener( 'click', this.hide.bind( this ) );
  	this.closeBtn = document.querySelector( expr + ' .close_btn' );
  	this.closeBtn.addEventListener( 'click', this.hide.bind( this ) );
  	this.hide();

  }


  show(){

  	this.element.style.display = 'block';
  	setTimeout(function(){
  		this.element.style.opacity = 1;
  	}.bind( this ), 100);
  	setTimeout(function(){
  		this.inner.style.opacity = 1;
  		this.inner.style.transform = 'translateY(0px)';
  	}.bind( this ), 400);

  }


  hide(){

	this.inner.style.opacity = 0;
	this.inner.style.transform = 'translateY(-20px)';
  	setTimeout(function(){
		this.element.style.opacity = 0;
  	}.bind( this ), 300);
  	setTimeout(function(){
	  	this.element.style.display = 'none';
  	}.bind( this ), 600);

  }

}
