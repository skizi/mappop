
import Modal from './Modal';
import Util from './Util';
import Loading from './Loading';
import FileUploadManager from './FileUploadManager';


export default class EditProfileModal extends Modal{

    constructor(){

        super( '.modal.edit_profile' );

        this.changePhoto = this.element.getElementsByClassName( 'change_photo' )[0];
        this.changeProfile = this.element.getElementsByClassName( 'change_profile' )[0];

        this.changeBtn0 = this.changePhoto.getElementsByClassName( 'change_type_btn' )[0];
        this.changeBtn0.addEventListener( 'click', this.changeBtn0ClickHandler.bind( this ) );
        this.changeBtn1 = this.changeProfile.getElementsByClassName( 'change_type_btn' )[0];
        this.changeBtn1.addEventListener( 'click', this.changeBtn1ClickHandler.bind( this ) );

    	this.hide();


        this.fileUploadManager = new FileUploadManager( '#file_photo', 200, 200, this.upload.bind( this ) );
        this.fileUploadManager.element.addEventListener( 'ysdCallback', this.fileUploadManagerCallBackHandler.bind( this ) );
        this.uploadBtn = this.element.getElementsByClassName( 'photo_upload_btn' )[0];
        this.uploadBtn.addEventListener( 'click', this.uploadBtnClickHandler.bind( this ) );


        this.photoContainer = document.querySelector( '.photo_container .photo' );

        this.loading = new Loading();

    }


    set type( _type ){

        this._type = _type;
        if( _type == 'profile' ){
            this.changeBtn0ClickHandler();
        }else{
            this.changeBtn1ClickHandler();
        }

    }


    changeBtn0ClickHandler(){

        this.changePhoto.style.display = 'none';
        this.changeProfile.style.display = 'block';

    }


    changeBtn1ClickHandler(){

        this.changePhoto.style.display = 'block';
        this.changeProfile.style.display = 'none';

    }


    uploadBtnClickHandler(){
        this.fileUploadManager.readFile();
    }


    fileUploadManagerCallBackHandler( e ){

        var obj = e.detail.value;
        switch( obj.type ){

            case 'readerLoadStart':
                this.loading.show();
                break;

        }

    }


    upload( img ){

        var formData = new FormData();
        var blob = this.fileUploadManager.dataURLtoBlob( img.getAttribute( 'src' ) );
        formData.append( 'upfile', blob, this.fileUploadManager.file.name );
        formData.append( 'id', document.getElementById( 'user_id' ).value );

        var url = Util.apiHeadUrl + '/users/upload_process.json';
        $.ajax({
            url:url,
            type:'POST',
            dataType: 'json',
            data:formData,
            processData: false,
            contentType: false,
            success:function( result ){
                this.uploadComp();
            }.bind( this ),
            error:function( result ){
                if( result.status == 200 ){
                    this.uploadComp();
                }else{
                    this.uploadComp( 'error' );
                }
            }.bind( this )
        });
    }


    uploadComp( type ){

        if( type == 'error' ){
            alert( 'アップロードエラー\n時間を置いてから試してみてください。' );
        }else{

            setTimeout(function(){
                this.hide();
            }.bind( this ), 600)
            this.photoContainer.style.backgroundImage = 'url(' + this.fileUploadManager.reader.result + ')';

            this.fileUploadManager.enabledFlag = false;
            setTimeout(function(){
                this.fileUploadManager.enabledFlag = true;
            }.bind( this ), 900);
        }

        this.loadFlag = false;
        this.file = null;
        this.loading.hide();
    
    }


}

