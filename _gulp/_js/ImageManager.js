
import Util from './Util';

export default class ImageManager{

    constructor(　w, h　){

        this.resizeWidth = 200;
        this.resizeHeight = 200;
        if( w ) this.resizeWidth = w;
        if( h ) this.resizeHeight = h;

        this.resizeCanvas = document.createElement( 'canvas' );
        this.resizeCanvas.style.display = 'none';
        // this.resizeCanvas.style.position = 'absolute';
        // this.resizeCanvas.style.top = '0px';
        // this.resizeCanvas.style.left = '0px';
        document.body.appendChild( this.resizeCanvas );
        this.resizeCtx = this.resizeCanvas.getContext( '2d' );

    }
 

    fixExif( img, callback ){

        if( img.complete ){
            this.fixExifStep2( img, callback );
        }else{
            var listener = function( _img, _callback ){
                _img.removeEventListener( 'load', _img.listener );
                this.fixExifStep2( _img, _callback );
            }.bind( this, img, callback );
            img.listener = listener;
            img.onload = listener;
        }

    }


    fixExifStep2( img, callback ){


        if( img.exifdata ) img.exifdata = null;
        EXIF.getData( img, function( _callback ) {

            if( img.exifdata && img.exifdata.Orientation ){
                 
                //rotation
                var orientation = img.exifdata.Orientation;

                var exifImg = new Image();
                exifImg.style.display = 'none';
                document.body.appendChild( exifImg );

                var mpImg = new MegaPixImage( img );
                mpImg.render( exifImg[0], { orientation:orientation, quality:1, maxWidth: this.resizeWidth, maxHeight: this.resizeHeight }, function( _img, _callback ){
                    _callback( _img );
                }.bind( this, exifImg[0], _callback ));

            }else{

                document.body.appendChild( img );
                var w = img.width;
                var h = img.height;
                img.style.display = 'none';
                var src = img.getAttribute( 'src' );

                if( w > this.resizeWidth || h > this.resizeHeight ){
                    var ratioX = this.resizeWidth / w;
                    var ratioY = this.resizeHeight / h;
                    // w *= ratioX;
                    // h *= ratioX;
                    // if( ratioY < ratioX ){
                    //     w *= ratioY;
                    //     h *= ratioY;
                    // }

                    src = this.resizeImg( img, this.resizeWidth, this.resizeHeight, 'image/jpeg', 'minSizeFit' );

                }
                document.body.removeChild( img );
                img = null;

                img = new Image();
                img.setAttribute( 'src', src );
                _callback( img );

            }
        }.bind( this, callback ));

    }


    resizeImg( img, w, h, imgType, resizeType ){

        if( !imgType ) imgType = 'image/jpeg';

        this.resizeCanvas.setAttribute( 'width', w );
        this.resizeCanvas.setAttribute( 'height', h );

        var canvasW = w;
        var canvasH = h;

        this.resizeCtx.fillStyle = "rgba( 0, 0, 0, 0 )";
        this.resizeCtx.fillRect( 0, 0, canvasW, canvasH);

         
        //'fit'の場合は縦横をwとhのサイズに縮める形で縮小
        var imgW = img.width;
        var imgH = img.height;
        if( resizeType == 'maxSizeFit' ){//縦横大きい方を基準に縮小
             
            var wRatio = imgW / canvasW;
            var hRatio = imgH / canvasH;
            var maxHFlag = false;
            if( wRatio < hRatio ) maxHFlag = true;
             
            if( maxHFlag ){
                var canvasRatio = canvasH / imgH;
                var w = imgW*canvasRatio;
                var h = canvasH;
            }else{
                var canvasRatio = canvasW / imgW;
                var w = canvasW;
                var h = imgH*canvasRatio;
            }

        }else if( resizeType == 'minSizeFit' ){//縦横小さい方を基準に縮小

            var wRatio = imgW / canvasW;
            var hRatio = imgH / canvasH;
            var maxHFlag = false;
            if( wRatio < hRatio ) maxHFlag = true;
             
            if( maxHFlag ){
                var canvasRatio = canvasW / imgW;
            }else{
                var canvasRatio = canvasH / imgH;
            }

            var w = imgW*canvasRatio;
            var h = imgH*canvasRatio;

        }else if( resizeType == 'xFit' ){//横を基準に縮小
            var canvasRatio = canvasW / imgW;
            var w = canvasW;
            var h = imgH*canvasRatio;
        }


        var x = ( canvasW - w ) * .5;
        var y = ( canvasH - h ) * .5;
        var imgAdjustPos = {
            x:x,
            y:y,
            w:w,
            h:h
        };

        //canvasに画像を描画
        this.resizeCtx.drawImage(img,
                            imgAdjustPos.x,
                            imgAdjustPos.y,
                            imgAdjustPos.w,
                            imgAdjustPos.h);

        return this.resizeCanvas.toDataURL( imgType, 1 );
    }

}