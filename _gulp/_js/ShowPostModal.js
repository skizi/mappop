
import Modal from './Modal';

export default class ShowPostModal extends Modal{

  constructor(){

    super( '.modal.show' );

    this.title = document.querySelector( '.modal.show .title' );
    this.content = document.querySelector( '.modal.show .content' );

  	this.hide();

  }


  setText( title, content ){

    this.title.value = title;
    this.content.value = content;

  }

}
