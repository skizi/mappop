
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
        this.zoom = 18;

        this.fileUploadManager = new FileUploadManager( '#fileContent', 200, 200, function( img ){
            this.uploadImage = img;
            this.photoContainer.style.backgroundImage = 'url(' + img.getAttribute( 'src' ) + ')';
            this.photoContainer.style.display = 'inline-block';
        }.bind( this ), 'auto', false );
        this.fileUploadManager.element.addEventListener( 'ysdCallback', this.fileUploadManagerCallBackHandler.bind( this ) );

        this.photoContainer = document.querySelector( '.file_selector .photo' );
        this.photoDeleteBtn = document.querySelector( '.file_selector .photo .delete_btn' );
        this.photoDeleteBtn.addEventListener( 'click', this.photoDeleteBtnClickHandler.bind( this ) );

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


    setLatLng( lat, lng, zoom ){

        this.lat = lat;
        this.lng = lng;
        this.zoom = zoom;

    }


    photoDeleteBtnClickHandler(){

        this.uploadImage = null;
        this.photoContainer.style.display = 'none';

    }


    reverseGeocoding( callback ){

    }


    submit(){

        if( this.loadFlag ) return;
        
        var title = this.title.value;
        var content = this.content.value;
        if( title == '' || content == '' ){
            alert( '未入力の箇所があります' );
            return;
        }

        var url = 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + this.lat + '&lon=' + this.lng + '&zoom=' + this.zoom;
        $.ajax({
            url:url,
            type:'GET',
            success:function( result ){
                this.submitStep2( result );
            }.bind( this ),
            error:function( result ){
                console.log( result );
            }.bind( this )
        });

    }


    submitStep2( result ){

        var title = this.title.value;
        var content = this.content.value;

        var photoUrl = '';
        var formData = new FormData();
        if( this.uploadImage ){
            photoUrl = this.uploadImage.getAttribute( 'src' );
            var blob = this.fileUploadManager.dataURLtoBlob( photoUrl );
            var name = this.fileUploadManager.file.name;
            name = name.split( '.' )[0] + '.jpg';
            formData.append( 'upfile', blob, name );
        }
        formData.append( 'title', title );
        formData.append( 'content', content );
        formData.append( 'lat', this.lat );
        formData.append( 'lng', this.lng );
        formData.append( 'user_id', app.user_id );
        formData.append( 'country', result.address.country );
        formData.append( 'state', result.address.state );
        formData.append( 'city', result.address.city );


        var url = Util.apiHeadUrl + '/questions.json';
        $.ajax({
            url:url,
            type:'POST',
            data:formData,
            processData: false,
            contentType: false,
            success:this.uploadComp.bind( this, title, content, photoUrl ),
            error:function( result ){
              console.log( result );
              this.loadFlag = false;
              this.uploadImage = null;
            }.bind( this )
        });

        this.loadFlag = true;
        this.hide();

    }


    uploadComp( title, content, photoUrl, result ){

        this.loadFlag = false;
        this.uploadImage = null;
        this.fileUploadManager.fileInputRefresh();

        var data = {
            type:'addPopup',
            title:title,
            content:content,
            lat:this.lat,
            lng:this.lng,
            photo:photoUrl,
            comments:[]
        };
        this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:data } } ) );

    }

}
