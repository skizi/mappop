
import Modal from './Modal';
import Util from './Util';
import ImageManager from './ImageManager';
import Loading from './Loading';


export default class EditProfileModal extends Modal{

    constructor(){

        super( '.modal.edit_profile' );

        this.enabledFlag = true;

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
        this.fileInput.addEventListener( 'click', this.fileChangeClickHandler.bind(this) );
        

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


    fileChangeClickHandler( e ){

        if( !this.enabledFlag ){
            e.preventDefault();
            return false;
        }

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

        if( !this.enabledFlag ) return;
        if( this.fileInput.value == '' ){
            alert( '画像を選択して下さい' );
            return;
        }

        if( this.loadFlag ){
            alert( '画像アップロード中です。\nお待ちください。' );
            return;
        }
        this.loading.show();
        this.loadFlag = true;

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


    uploadComp( type ){

        if( type == 'error' ){
            alert( 'アップロードエラー\n時間を置いてから試してみてください。' );
        }else{

            setTimeout(function(){
                this.hide();
            }.bind( this ), 600)
            this.photoContainer.style.backgroundImage = 'url(' + this.reader.result + ')';

            this.enabledFlag = false;
            setTimeout(function(){
                this.enabledFlag = true;
            }.bind( this ), 900);
        }

        this.loadFlag = false;
        this.file = null;
        this.loading.hide();
    
    }


}

