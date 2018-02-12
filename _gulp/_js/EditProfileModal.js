
import Modal from './Modal';
import Util from './Util';
import ImageManager from './ImageManager';


export default class EditProfileModal extends Modal{

    constructor(){

        super( '.modal.edit_profile' );

        // this.name = document.querySelector( '.modal.edit_profile .name' );
        // this.location = document.querySelector( '.modal.edit_profile .location' );
        // this.about = document.querySelector( '.modal.edit_profile .about' );
        // this.submitBtn = document.querySelector( '.modal.edit_profile .submit_btn' );
        // this.submitBtn.addEventListener( 'click', this.submitBtnClickHandler.bind( this ) );

        this.changePhoto = this.element.getElementsByClassName( 'change_photo' )[0];
        this.changeProfile = this.element.getElementsByClassName( 'change_profile' )[0];

        this.changeBtn0 = this.changePhoto.getElementsByClassName( 'change_type_btn' )[0];
        this.changeBtn0.addEventListener( 'click', this.changeBtn0ClickHandler.bind( this ) );
        this.changeBtn1 = this.changeProfile.getElementsByClassName( 'change_type_btn' )[0];
        this.changeBtn1.addEventListener( 'click', this.changeBtn1ClickHandler.bind( this ) );

    	this.hide();

        this.reader = new FileReader();
        this.imageManager = new ImageManager();

        this.fileInput = document.getElementById( 'file_photo' );
        this.fileInput.addEventListener( 'change', this.fileChangeHandler.bind(this) );

        this.uploadBtn = this.element.getElementsByClassName( 'photo_upload_btn' )[0];
        this.uploadBtn.addEventListener( 'click', this.uploadBtnClickHandler.bind( this ) );

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




    fileChangeHandler( e ){

        if( this.loadFlag ) e.preventDefault();
     
        var file = e.target.files[0];


        //エラーチェック------------
        var errorFlag = false;
        var errorMessage = '';


        //容量チェック
        var size = 5000000;
        if( file.size > size ) {
            errorMessage = str + '3MB以下のファイルを選択してください';
            errorFlag = true;
        }

        if( file.name.indexOf( '.jpg' ) == -1 &&
            file.name.indexOf( '.jpeg' ) == -1 &&
            file.name.indexOf( '.png' ) == -1 &&
            file.name.indexOf( '.JPG' ) == -1 &&
            file.name.indexOf( '.PNG' ) == -1 ){
            errorMessage = '画像はjpegかpngを選択してください';
            errorFlag = true;
        }

        //もしエラーフラグが立ってたらreturn
        if( errorFlag ){
            this.fileInputRefresh();
            alert( errorMessage );
            return;
        }

        this.file = file;

    }


    fileInputRefresh(){

        this.fileInput.value = '';

    }


    uploadBtnClickHandler(){

        if( !this.file ) return;

        this.reader.onload = function(e) {

            var img = new Image();
            img.setAttribute( 'src', this.reader.result );
            this.imageManager.fixExif( img, function( _img ){
                this.upload( _img );
                this.fileInputRefresh();
            }.bind( this ) );

        }.bind( this )
        this.reader.readAsDataURL( this.file );

    }


    upload( img ){

        this.loadFlag = true;

        var formData = new FormData();
        var blob = this.dataURLtoBlob( img.getAttribute( 'src' ) );
        formData.append( 'upfile', blob, this.file.name );
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
                this.loadFlag = false;
                this.file = null;
            }.bind( this ),
            error:function( result ){
                this.loadFlag = false;
                this.file = null;
                if( result.status == 200 ){

                }else{
                    alert( 'アップロードエラー\n時間を置いてから試してみてください。' );
                }
            }.bind( this )
        });
    }


    dataURLtoBlob( dataurl ){

        var bin = atob(dataurl.split("base64,")[1]);
        var len = bin.length;
        var barr = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            barr[i] = bin.charCodeAt(i);
        }
        return new Blob([barr], {
            type: 'image/jpeg',
        });
    
    }


}

