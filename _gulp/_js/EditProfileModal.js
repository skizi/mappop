
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


        this.fileUploadManager = new FileUploadManager( '#file_photo', 200, 200, this.upload.bind( this ), 'auto', true );
        this.fileUploadManager.element.addEventListener( 'ysdCallback', this.fileUploadManagerCallBackHandler.bind( this ) );
        // this.uploadBtn = this.element.getElementsByClassName( 'photo_upload_btn' )[0];
        // this.uploadBtn.addEventListener( 'click', this.uploadBtnClickHandler.bind( this ) );

        this.photoCircle = document.querySelector( '.photo_circle' );


        this.topPhotoContainer = document.querySelector( '.photo_container .photo' );

        this.loading = new Loading();
        
        this.authenticity_token = document.getElementById( 'authenticity_token' ).value;

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

            case 'imgLoadComp':
                this.photoCircle.style.backgroundImage = 'url(' + obj.img.getAttribute( 'src' ) + ')';
                break;

            case 'startExif':
                this.loading.show();
                break;

        }

    }


    upload( img ){

        var formData = new FormData();
        var blob = this.fileUploadManager.dataURLtoBlob( img.getAttribute( 'src' ) );
        var name = this.fileUploadManager.file.name;
        name = name.split( '.' )[0] + '.jpg';
        formData.append( 'upfile', blob, name );
        formData.append( 'id', document.getElementById( 'user_id' ).value );
        formData.append( 'authenticity_token', this.authenticity_token );

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

        this.loadFlag = false;
        this.loading.hide();

        if( type == 'error' ){
            alert( 'アップロードエラー\n時間を置いてから試してみてください。' );
        }else{

            setTimeout(function(){
                alert( 'プロフィール画像を更新しました。' );
                this.hide();
            }.bind( this ), 600)
            this.topPhotoContainer.style.backgroundImage = 'url(' + this.fileUploadManager.reader.result + ')';

            this.fileUploadManager.enabledFlag = false;
            setTimeout(function(){
                this.fileUploadManager.enabledFlag = true;
            }.bind( this ), 900);
        }
    
        this.file = null;
    }


}

