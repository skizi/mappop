
import Modal from './Modal';
import Util from './Util';

export default class NewPostModal extends Modal{

  constructor(){

    super( '.modal.new' );
  		
  	this.submitBtn = document.querySelector( '.submit_btn' );
    this.submitBtn.addEventListener( 'click', this.submit.bind( this ) );

    this.title = document.querySelector( '.modal.new .title' );
    this.content = document.querySelector( '.modal.new .content' );
    this.lat = 0;
    this.lng = 0;

  	this.hide();

  }


  submit(){

    if( this.loadFlag ) return;

    var title = this.title.value;
    var content = this.content.value;
    if( title == '' || content == '' ){
      alert( '未入力の箇所があります' );
      return;
    }

    var url = Util.apiHeadUrl + '/questions.json';
    $.ajax({
        url:url,
        type:'POST',
        // xhrFields: {
        //   withCredentials: true
        // },
        data:{
            title:title,
            content:content,
            lat:this.lat,
            lng:this.lng,
            user_id:app.user_id
        },
        success:function( result ){
          console.log( result );
          this.loadFlag = false;
        }.bind( this ),
        error:function( result ){
          console.log( result );
          this.loadFlag = false;
        }.bind( this )
    });

    this.loadFlag = true;
    this.hide();

  }

}
