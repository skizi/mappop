
import Util from './Util';
import ImageManager from './ImageManager';

export default class FileUploadManager{


    constructor( inputExpr, w, h, callback, type ){

        this.callback = callback;
        this.type = type;

        this.element = document.querySelector( inputExpr );
        this.element.addEventListener( 'change', this.fileChangeHandler.bind(this) );
        this.element.addEventListener( 'click', this.fileChangeClickHandler.bind(this) );

        this.reader = new FileReader();
        this.imageManager = new ImageManager( w, h );

        this.enabledFlag = true;
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

        if( this.type == 'auto' ) this.readFile();

    }


    fileInputRefresh(){

        this.element.value = '';

    }


    readFile(){

        if( !this.enabledFlag ) return;
        if( this.element.value == '' ){
            alert( '画像を選択して下さい' );
            return;
        }

        if( this.loadFlag ){
            alert( '画像アップロード中です。\nお待ちください。' );
            return;
        }
        this.loadFlag = true;
        this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'readerLoadStart' } } } ) );
        
        this.reader.onload = function(e) {

            var img = new Image();
            img.setAttribute( 'src', this.reader.result );
            this.imageManager.fixExif( img, function( _img ){
                this.loadFlag = false;
                this.fileInputRefresh();
                this.callback( _img );
            }.bind( this ) );

        }.bind( this )
        this.reader.readAsDataURL( this.file );

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