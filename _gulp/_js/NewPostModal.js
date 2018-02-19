
import Modal from './Modal';
import Util from './Util';
import ImageManager from './ImageManager';
import FileUploadManager from './FileUploadManager';

export default class NewPostModal extends Modal{

  constructor(){

    super( '.modal.new' );
  		
  	this.submitBtn = document.querySelector( '.submit_btn' );
    this.submitBtn.addEventListener( 'click', this.submit.bind( this ) );

    this.title = document.querySelector( '#questionTitle' );
    this.content = document.querySelector( '#questionContent' );
    this.lat = 0;
    this.lng = 0;

    this.fileUploadManager = new FileUploadManager( '#fileContent', 200, 200, function( img ){
      this.uploadImage = img;
    }.bind( this ), 'auto' );
    this.fileUploadManager.element.addEventListener( 'ysdCallback', this.fileUploadManagerCallBackHandler.bind( this ) );

  	this.hide();

  }


  fileUploadManagerCallBackHandler( e ){

      var obj = e.detail.value;
      switch( obj.type ){

          case 'readerLoadStart':
              //this.loading.show();
              break;

      }

  }


  submit(){

    if( this.loadFlag ) return;

    var title = this.title.value;
    var content = this.content.value;
    if( title == '' || content == '' ){
      alert( '未入力の箇所があります' );
      return;
    }

    var formData = new FormData();
    if( this.uploadImage ){
      var blob = this.fileUploadManager.dataURLtoBlob( this.uploadImage.getAttribute( 'src' ) );
      formData.append( 'upfile', blob, this.fileUploadManager.file.name );
    }
    formData.append( 'title', title );
    formData.append( 'content', content );
    formData.append( 'lat', this.lat );
    formData.append( 'lng', this.lng );
    formData.append( 'user_id', app.user_id );


    var url = Util.apiHeadUrl + '/questions.json';
    $.ajax({
        url:url,
        type:'POST',
        data:formData,
        processData: false,
        contentType: false,
        success:function( result ){
          console.log( result );
          this.loadFlag = false;
          this.uploadImage = null;
        }.bind( this ),
        error:function( result ){
          console.log( result );
          this.loadFlag = false;
          this.uploadImage = null;
        }.bind( this )
    });

    this.loadFlag = true;
    this.hide();

  }

}
