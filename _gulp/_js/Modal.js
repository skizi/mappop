
export default class Modal{

  constructor( expr ){

  	this.element = document.querySelector( expr );
  	this.inner = this.element.getElementsByClassName( 'inner' )[0];
  	this.closeBtn = document.querySelector( expr + ' .close_btn' );
  	this.closeBtn.addEventListener( 'click', this.hide.bind( this ) );
  	this.hide();

  }


  show(){

      this.element.style.display = 'block';
      setTimeout(function(){
          this.inner.style.transform = 'translateX(0%)';
      }.bind( this ), 100);

  }


  hide(){

      this.inner.style.transform = 'translateX(-100%)';
      setTimeout(function(){
          this.element.style.display = 'none';
      }.bind( this ), 300);

  }

}
