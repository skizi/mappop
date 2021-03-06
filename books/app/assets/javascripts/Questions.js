(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _ImageManager = require('./ImageManager');

var _ImageManager2 = _interopRequireDefault(_ImageManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileUploadManager = function () {
    function FileUploadManager(inputExpr, w, h, callback, type, autoRefreshFlag) {
        _classCallCheck(this, FileUploadManager);

        this.callback = callback;
        this.type = type;
        this.autoRefreshFlag = autoRefreshFlag;

        this.element = document.querySelector(inputExpr);
        this.element.addEventListener('change', this.fileChangeHandler.bind(this));
        this.element.addEventListener('click', this.fileChangeClickHandler.bind(this));

        this.reader = new FileReader();
        this.imageManager = new _ImageManager2.default(w, h);

        this.enabledFlag = true;
    }

    _createClass(FileUploadManager, [{
        key: 'fileChangeClickHandler',
        value: function fileChangeClickHandler(e) {

            if (!this.enabledFlag) {
                e.preventDefault();
                return false;
            }
        }
    }, {
        key: 'fileChangeHandler',
        value: function fileChangeHandler(e) {

            if (this.loadFlag) e.preventDefault();
            if (this.element.value == '') return;

            var file = e.target.files[0];

            //エラーチェック------------
            var errorFlag = false;
            var errorMessage = '';

            //容量チェック
            var size = 5000000;
            if (file.size > size) {
                errorMessage = str + '3MB以下のファイルを選択してください';
                errorFlag = true;
            }

            if (file.name.indexOf('.jpg') == -1 && file.name.indexOf('.jpeg') == -1 && file.name.indexOf('.png') == -1 && file.name.indexOf('.JPG') == -1 && file.name.indexOf('.PNG') == -1) {
                errorMessage = '画像はjpegかpngを選択してください';
                errorFlag = true;
            }

            //もしエラーフラグが立ってたらreturn
            if (errorFlag) {
                this.fileInputRefresh();
                alert(errorMessage);
                return;
            }

            this.file = file;

            this.reader.onload = function (e) {
                this.img = new Image();
                this.img.setAttribute('src', this.reader.result);
                this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'imgLoadComp', img: this.img } } }));
                if (this.type == 'auto') this.readFile();
            }.bind(this);
            this.reader.readAsDataURL(this.file);
        }
    }, {
        key: 'fileInputRefresh',
        value: function fileInputRefresh() {

            this.element.value = '';
        }
    }, {
        key: 'readFile',
        value: function readFile() {

            if (!this.enabledFlag) return;
            if (this.element.value == '') {
                alert('画像を選択して下さい');
                return;
            }

            if (this.loadFlag) {
                alert('画像アップロード中です。\nお待ちください。');
                return;
            }
            this.loadFlag = true;
            this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'startExif' } } }));

            this.imageManager.fixExif(this.img, function (_img) {
                this.loadFlag = false;
                if (this.autoRefreshFlag) this.fileInputRefresh();
                this.callback(_img);
            }.bind(this));
        }
    }, {
        key: 'dataURLtoBlob',
        value: function dataURLtoBlob(dataurl) {

            var bin = atob(dataurl.split("base64,")[1]);
            var len = bin.length;
            var barr = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                barr[i] = bin.charCodeAt(i);
            }
            return new Blob([barr], {
                type: 'image/jpeg'
            });
        }
    }]);

    return FileUploadManager;
}();

exports.default = FileUploadManager;

},{"./ImageManager":2,"./Util":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageManager = function () {
    function ImageManager(w, h) {
        _classCallCheck(this, ImageManager);

        this.resizeWidth = 200;
        this.resizeHeight = 200;
        if (w) this.resizeWidth = w;
        if (h) this.resizeHeight = h;

        this.resizeCanvas = document.createElement('canvas');
        this.resizeCanvas.style.display = 'none';
        // this.resizeCanvas.style.position = 'absolute';
        // this.resizeCanvas.style.top = '0px';
        // this.resizeCanvas.style.left = '0px';
        document.body.appendChild(this.resizeCanvas);
        this.resizeCtx = this.resizeCanvas.getContext('2d');
    }

    _createClass(ImageManager, [{
        key: 'fixExif',
        value: function fixExif(img, callback) {

            if (img.complete) {
                this.fixExifStep2(img, callback);
            } else {
                var listener = function (_img, _callback) {
                    _img.removeEventListener('load', _img.listener);
                    this.fixExifStep2(_img, _callback);
                }.bind(this, img, callback);
                img.listener = listener;
                img.onload = listener;
            }
        }
    }, {
        key: 'fixExifStep2',
        value: function fixExifStep2(img, callback) {

            if (img.exifdata) img.exifdata = null;
            EXIF.getData(img, function (_callback) {

                if (img.exifdata && img.exifdata.Orientation) {

                    //rotation
                    var orientation = img.exifdata.Orientation;

                    var exifImg = new Image();
                    exifImg.style.display = 'none';
                    document.body.appendChild(exifImg);

                    var mpImg = new MegaPixImage(img);
                    mpImg.render(exifImg[0], { orientation: orientation, quality: 1, maxWidth: this.resizeWidth, maxHeight: this.resizeHeight }, function (_img, _callback) {
                        _callback(_img);
                    }.bind(this, exifImg[0], _callback));
                } else {

                    document.body.appendChild(img);
                    var w = img.width;
                    var h = img.height;
                    img.style.display = 'none';
                    var src = img.getAttribute('src');

                    if (w > this.resizeWidth || h > this.resizeHeight) {
                        var ratioX = this.resizeWidth / w;
                        var ratioY = this.resizeHeight / h;
                        // w *= ratioX;
                        // h *= ratioX;
                        // if( ratioY < ratioX ){
                        //     w *= ratioY;
                        //     h *= ratioY;
                        // }

                        src = this.resizeImg(img, this.resizeWidth, this.resizeHeight, 'image/jpeg', 'minSizeFit');
                    }
                    document.body.removeChild(img);
                    img = null;

                    img = new Image();
                    img.setAttribute('src', src);
                    _callback(img);
                }
            }.bind(this, callback));
        }
    }, {
        key: 'resizeImg',
        value: function resizeImg(img, w, h, imgType, resizeType) {

            if (!imgType) imgType = 'image/jpeg';

            this.resizeCanvas.setAttribute('width', w);
            this.resizeCanvas.setAttribute('height', h);

            var canvasW = w;
            var canvasH = h;

            this.resizeCtx.fillStyle = "rgba( 0, 0, 0, 0 )";
            this.resizeCtx.fillRect(0, 0, canvasW, canvasH);

            //'fit'の場合は縦横をwとhのサイズに縮める形で縮小
            var imgW = img.width;
            var imgH = img.height;
            if (resizeType == 'maxSizeFit') {
                //縦横大きい方を基準に縮小

                var wRatio = imgW / canvasW;
                var hRatio = imgH / canvasH;
                var maxHFlag = false;
                if (wRatio < hRatio) maxHFlag = true;

                if (maxHFlag) {
                    var canvasRatio = canvasH / imgH;
                    var w = imgW * canvasRatio;
                    var h = canvasH;
                } else {
                    var canvasRatio = canvasW / imgW;
                    var w = canvasW;
                    var h = imgH * canvasRatio;
                }
            } else if (resizeType == 'minSizeFit') {
                //縦横小さい方を基準に縮小

                var wRatio = imgW / canvasW;
                var hRatio = imgH / canvasH;
                var maxHFlag = false;
                if (wRatio < hRatio) maxHFlag = true;

                if (maxHFlag) {
                    var canvasRatio = canvasW / imgW;
                } else {
                    var canvasRatio = canvasH / imgH;
                }

                var w = imgW * canvasRatio;
                var h = imgH * canvasRatio;
            } else if (resizeType == 'xFit') {
                //横を基準に縮小
                var canvasRatio = canvasW / imgW;
                var w = canvasW;
                var h = imgH * canvasRatio;
            }

            var x = (canvasW - w) * .5;
            var y = (canvasH - h) * .5;
            var imgAdjustPos = {
                x: x,
                y: y,
                w: w,
                h: h
            };

            //canvasに画像を描画
            this.resizeCtx.drawImage(img, imgAdjustPos.x, imgAdjustPos.y, imgAdjustPos.w, imgAdjustPos.h);

            return this.resizeCanvas.toDataURL(imgType, 1);
        }
    }]);

    return ImageManager;
}();

exports.default = ImageManager;

},{"./Util":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loading = function () {
    function Loading() {
        _classCallCheck(this, Loading);

        this.element = document.getElementsByClassName('loading_cover')[0];
    }

    _createClass(Loading, [{
        key: 'show',
        value: function show() {

            this.element.style.display = 'block';
            this.element.style.opacity = 0;
            setTimeout(function () {
                this.element.style.opacity = 1;
            }.bind(this), 100);
        }
    }, {
        key: 'hide',
        value: function hide() {

            this.element.style.opacity = 0;
            setTimeout(function () {
                this.element.style.display = 'none';
            }.bind(this), 300);
        }
    }]);

    return Loading;
}();

exports.default = Loading;

},{"./Util":9}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
  function Map() {
    _classCallCheck(this, Map);

    this.zoom = 13;
    this.debugFlag = false;
    this.ajaxData = {};

    this.element = document.querySelector('.map_container .map');
    this.btn = document.querySelector('.map_container .btn0');
    this.btn.addEventListener('click', this.btnClickHandler.bind(this));

    /*
     this.map = new google.maps.Map( this.element, {
       center: {lat:35.67848924554223, lng:139.76272863769532 },
       zoom: 12,
       fullscreenControl:false,
       mapTypeControl:false,
       streetViewControl:false,
       zoomControl:false
     });
     */

    //ドラッグ後に、この半径内に存在する質問をサーバーから取得する
    this.searchRadius = 500;

    var latlng = [35.67848924554223, 139.76272863769532];
    this.map = L.map('leafletMap').setView(latlng, this.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    //なぜかRetina対応タイルが存在しない
    //'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png',
    {
      attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      minZoom: 3,
      maxZoom: 18
      //detectRetina:true
    }).addTo(this.map);

    //移動範囲を限定させる
    this.map.setMaxBounds(new L.LatLngBounds([-90, -180], [90, 180]));

    this.popups = {};
    this.allPopupLength = 0;

    this.rankerPopups = {};
    this.rankerPopups['country'] = [];
    this.rankerPopups['state'] = [];
    this.rankerPopups['city'] = [];

    this.oldIndexs = [];
    this.map.on('moveend', this.mapMoved.bind(this));
    this.map.on('zoomstart', this.mapZoomStart.bind(this));
    this.map.on('zoomend', this.mapZoomEnd.bind(this));
    // this.map.on( 'load', function(){
    // }.bind( this ) );
    //L.marker([ _maxLatLng.lat, _maxLatLng.lng ]).addTo(this.map);


    L.Icon.Default.imagePath = './assets/map/leaflet/';

    window.onload = this.checkNewQuestions.bind(this);

    //ユーザーの現在地を取得
    this.checkGps();
    //this.gpsIntervalId = setInterval( this.checkGps.bind( this ), 5000 );


    this.flickr_api_key = 'e43be56cbfe5eeada91756f2a08bd314';
  }

  _createClass(Map, [{
    key: 'mapMoved',
    value: function mapMoved() {

      this.checkNewQuestions();
    }
  }, {
    key: 'mapZoomStart',
    value: function mapZoomStart() {

      this.allDelete();
    }
  }, {
    key: 'allDelete',
    value: function allDelete() {

      var length = this.oldIndexs.length;
      for (var i = length - 1; i > -1; i--) {
        this.removeData(i);
      }this.oldIndexs = [];
    }
  }, {
    key: 'mapZoomEnd',
    value: function mapZoomEnd() {

      this.zoom = this.map.getZoom();
      console.log("zoom:" + this.zoom);
      this.latLngDist = this.getLatLngDist();
    }
  }, {
    key: 'checkNewQuestions',
    value: function checkNewQuestions() {

      var c = this.map.getCenter();
      var now = this.getSplitAreaId(c.lat, c.lng);
      var hasFlag = this.hasOldIndex(now);
      if (!hasFlag) {
        //地域名を取得してからポップアップ表示
        if (this.reverseGeocodingAjax) this.reverseGeocodingAjax.abort();
        this.reverseGeocodingAjax = this.reverseGeocoding(function (_now, r) {
          this.reverseGeocodingAjax = null;
          var place = r.address.state; // + ',';
          if (r.address.city) {
            //place += r.address.city;
          } else if (r.address.county) {
            //place += r.address.county;
          }
          this.getData(_now, this.jsonLoadComp.bind(this, _now.x, _now.y), 'question');
          this.getData(_now, this.flickrLoadComp.bind(this, _now.x, _now.y), 'flickr');
          this.getData(_now, this.chiikinogennkiLoadComp.bind(this, _now.x, _now.y), 'chiikinogennki', place);
          this.getData(_now, this.yahooLoadComp.bind(this, _now.x, _now.y), 'yahoo');
        }.bind(this, now));

        var data = { x: now.x, y: now.y };
        if (this.debugFlag) {
          var c = "#" + Math.floor(Math.random() * 16777215).toString(16);
          var bounds = [[now.minLatLng.lat, now.minLatLng.lng], [now.maxLatLng.lat, now.maxLatLng.lng]];
          data.debugRect = L.rectangle(bounds, { color: c, weight: 1 }).addTo(this.map);
        }

        //タイルindexキャッシュ
        this.oldIndexs.push(data);
      }

      //２マスはなれたポップアップたちを削除
      var length = this.oldIndexs.length;
      for (var i = length - 1; i > -1; i--) {
        var old = this.oldIndexs[i];
        var distX = Math.abs(old.x - now.x);
        var distY = Math.abs(old.y - now.y);
        if (distX + distY > 2) {
          this.removeData(i);
        }
      }
    }
  }, {
    key: 'removeData',
    value: function removeData(i) {

      var data = this.oldIndexs[i];
      this.removePopups(data.x, data.y);
      if (this.debugFlag) data.debugRect.remove();
      this.oldIndexs.splice(i, 1);
    }
  }, {
    key: 'hasOldIndex',
    value: function hasOldIndex(now) {

      var flag = false;
      var length = this.oldIndexs.length;
      for (var i = 0; i < length; i++) {
        if (this.oldIndexs[i].x == now.x && this.oldIndexs[i].y == now.y) {
          flag = true;
        }
      }

      return flag;
    }

    //地図全体を升目で区切り
    //latとlngとzoomレベルからから升目のxとyのindex番号を取得する

  }, {
    key: 'getSplitAreaId',
    value: function getSplitAreaId(lat, lng) {

      //↓モニターに写っている領域の全体からみたパーセンテージ
      //var perX = ( モニターのmaxLat - モニターのminLat ) / 180
      //
      //↓地図を何文割するかの数値
      //var lengthX = 180 / ( モニターのmaxLat - モニターのminLat )
      //var lengthY = 360 / ( モニターのmaxLng - モニターのminLng )

      //ただ、モニターのサイズはデバイスによって違うので、
      //ここでのモニターのサイズは固定で定義するべき 1000 * 1000　ぐらい・・・？


      if (!this.latLngDist) this.latLngDist = this.getLatLngDist();
      var w = this.latLngDist.x;
      var h = this.latLngDist.y;

      var perX = (lng + 180) / 360;
      var perY = (lat + 90) / 180;
      var lengthX = 360 / w;
      var lengthY = 180 / h;

      //各倍率のlengthX, lengthYをクライアントの配列に全て保持し、
      //フキダシのlat lngのみサーバーに保存

      //現在のマップの中心地が入る升目を調べ
      //その 升目のminとmaxの間に含まれるフキダシを全て表示


      var x = Math.floor(lengthX * perX);
      if (x == lengthX) x = lengthX - 1;

      var y = Math.floor(lengthY * perY);
      if (y == lengthY) y = lengthY - 1;

      if (lat < -90) y = 0;
      if (lat > 90) y = lengthY - 1;
      if (lng < -180) x = 0;
      if (lng > 180) x = lengthX - 1;

      var _x = w * x - 180;
      var _y = h * y - 90;
      var _minLatLng = L.latLng(_y + h, _x);
      var _maxLatLng = L.latLng(_y, _x + w);
      // console.log( "minLatLng----" );
      // console.log( _minLatLng.lat, _minLatLng.lng );

      // console.log( "origin----" );
      // console.log( lat, lng );

      // console.log( "maxLatLng----" );
      // console.log( _maxLatLng.lat, _maxLatLng.lng );


      return { x: x, y: y, minLatLng: _minLatLng, maxLatLng: _maxLatLng };
    }
  }, {
    key: 'getData',
    value: function getData(hitAreaData, callback, type, place) {

      var index = { x: hitAreaData.x, y: hitAreaData.y };

      switch (type) {

        case 'question':
          var data = {
            min_lat: hitAreaData.minLatLng.lat,
            min_lng: hitAreaData.minLatLng.lng,
            max_lat: hitAreaData.maxLatLng.lat,
            max_lng: hitAreaData.maxLatLng.lng,
            limit: 20
          };
          var url = _Util2.default.apiHeadUrl + '/questions/search_lat_lng.json';
          break;

        case 'flickr':
          var bbox = hitAreaData.minLatLng.lng + ',' + hitAreaData.maxLatLng.lat + ',' + hitAreaData.maxLatLng.lng + ',' + hitAreaData.minLatLng.lat;
          var limit = 10;
          var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + this.flickr_api_key + '&sort=interestingness-desc&bbox=' + bbox + '&has_geo=1&geo_context=1&extras=date_upload&format=json&nojsoncallback=1&per_page=' + limit;
          break;

        case 'chiikinogennki':
          var radDist = hitAreaData.minLatLng.lat - hitAreaData.maxLatLng.lat;
          var data = {
            limit: 50,
            // lng : hitAreaData.minLatLng.lng,
            // lat : hitAreaData.maxLatLng.lat,
            // dist : radDist * 111263.283,//１度の距離
            place: place,
            min_lat: hitAreaData.minLatLng.lat,
            min_lng: hitAreaData.minLatLng.lng,
            max_lat: hitAreaData.maxLatLng.lat,
            max_lng: hitAreaData.maxLatLng.lng
          };
          var url = _Util2.default.apiHeadUrl + '/questions/get_k_cloud';
          break;

        case 'yahoo':
          var data = {
            min_lat: hitAreaData.minLatLng.lat,
            min_lng: hitAreaData.minLatLng.lng,
            max_lat: hitAreaData.maxLatLng.lat,
            max_lng: hitAreaData.maxLatLng.lng,
            limit: 10
          };
          var url = _Util2.default.apiHeadUrl + '/questions/get_yahoo';
          break;
      }

      //ajaxリクエスト
      this.checkAbort(this.ajaxData[type]);
      this.ajaxData[type] = { index: index };
      this.ajaxData[type].ajax = $.ajax({
        url: url,
        crossDomain: true,
        type: 'GET',
        data: data,
        success: function (_callback, _type, result) {
          this.ajaxData[_type] = null;
          _callback(result);
        }.bind(this, callback, type),
        error: function (_callback, _type, result) {
          this.ajaxData[_type] = null;
          //_callback( result );
        }.bind(this, callback, type)
      });
    }

    //もし古いデータが残っていたら、ajaxキャンセル＆キャッシュされたデータを削除

  }, {
    key: 'checkAbort',
    value: function checkAbort(ajaxData) {

      if (ajaxData) {
        var _i = -1;
        var length = this.oldIndexs.length;
        for (var i = 0; i < length; i++) {
          if (ajaxData.index.x == this.oldIndexs[i].x && ajaxData.index.y == this.oldIndexs[i].y) {
            _i = i;
          }
        }
        if (_i != -1) this.removeData(_i);

        //abortが走るとajaxErrorが発行されてしまい、
        //ajaxDataがnullになってしまうので、後でabortする
        ajaxData.ajax.abort();
      }
    }
  }, {
    key: 'reverseGeocoding',
    value: function reverseGeocoding(callback) {

      var c = this.map.getCenter();
      var z = this.map.getZoom();
      var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + c.lat + '&lon=' + c.lng + '&zoom=' + z;
      if (this.nowRankingAjax) this.nowRankingAjax.abort();
      this.nowRankingAjax = $.ajax({
        url: url,
        type: 'GET',
        success: function (_callback, result) {
          _callback(result);
        }.bind(this, callback),
        error: function (result) {
          console.log(result);
        }.bind(this)
      });
    }
    /*
    
      getRankingDataStep2( limit, callback, result ){
    
        var cityName = result.address.city;
    
        var data = {
          //key:result.address.city,
          limit:limit
        };
        var url = Util.apiHeadUrl + '/questions/get_ranking/' + cityName;
        if( this.nowRankingAjax ) this.nowRankingAjax.abort();
        this.nowRankingAjax = $.ajax({
            url:url,
            type:'GET',
            dataType:'json',
            data:data,
            success:function( _callback, _cityName, result ){
              this.ajaxData = null;
              if( _callback ) _callback( result, _cityName );
            }.bind( this, callback, cityName ),
            error:function( _callback, result ){
              this.ajaxData = null;
              //_callback( result );
            }.bind( this, callback )
        });
    
      }
      */

  }, {
    key: 'flickrLoadComp',
    value: function flickrLoadComp(x, y, results) {

      var length = results.photos.photo.length;
      for (var i = 0; i < length; i++) {

        var photo = results.photos.photo[i];
        var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&format=json&nojsoncallback=1&api_key=' + this.flickr_api_key + '&photo_id=' + photo.id;
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          data: {},
          success: function (_x, _y, _photo, result) {

            var src = "https://farm" + _photo.farm + ".static.flickr.com/" + _photo.server + "/" + _photo.id + "_" + _photo.secret;
            var thumbnailSrc = src + "_m.jpg";
            src = src + ".jpg";
            var obj = result.photo.location;
            var title = obj.country._content;
            if (obj.locality) title += ' ' + obj.locality._content;
            if (obj.neighbourhood) title += ' ' + obj.neighbourhood._content;
            var data = {
              lat: obj.latitude,
              lng: obj.longitude,
              photo: src,
              thumbnailSrc: thumbnailSrc,
              id: obj.id,
              src: src,
              title: title,
              type: 'flickr'
            };
            this.jsonLoadComp(_x, _y, [data]);
          }.bind(this, x, y, photo),
          error: function (result) {}.bind(this)
        });
        //if ( i == 3 ) return false;
      }
    }
  }, {
    key: 'yahooLoadComp',
    value: function yahooLoadComp(x, y, results) {

      var _results = [];
      var length = results.result.Feature.length;
      for (var i = 0; i < length; i++) {

        var data = results.result.Feature[i];
        var title = '';
        var photo = '';
        if (data.Name) title = data.Name;
        if (data.Property.LeadImage) photo = data.Property.LeadImage;

        var content = '';
        if (data.Property) content = data.Property.Address;

        var latLng = data.Geometry.Coordinates.split(',');
        var lat = latLng[1];
        var lng = latLng[0];
        _results.push(this.generateData(title, content, photo, lat, lng, 'yahoo'));
      }

      this.jsonLoadComp(x, y, _results);
    }
  }, {
    key: 'chiikinogennkiLoadComp',
    value: function chiikinogennkiLoadComp(x, y, results) {

      var _results = [];
      var length = results.tourspots.length;
      for (var i = 0; i < length; i++) {

        var data = results.tourspots[i];
        var title = '';
        var photo = '';
        if (data.name) {
          if (data.name.written) title = data.name.written;
          if (data.name.name1) title += data.name.name1.written;
          if (data.name.name2) title += data.name.name2.written;
        }
        if (data.views && data.views[0].fid && data.place.url) {
          var refbase = data.mng.refbase;
          photo = 'https://www.chiikinogennki.soumu.go.jp/k-cloud-api/v001/kanko/view/' + refbase + '/' + data.views[0].fid;
        }

        var content = '';
        if (data.descs) {
          content = data.descs[0].body;
        }

        var lat = data.place.coordinates.latitude;
        var lng = data.place.coordinates.longitude;
        _results.push(this.generateData(title, content, photo, lat, lng, 'chiikinogennki'));
      }

      this.jsonLoadComp(x, y, _results);
    }
  }, {
    key: 'generateData',
    value: function generateData(title, content, photo, lat, lng, type) {

      var data = {
        title: title,
        content: content,
        photo: photo,
        lat: lat,
        lng: lng,
        likes: [],
        type: type
      };

      return data;
    }
  }, {
    key: 'jsonLoadComp',
    value: function jsonLoadComp(x, y, results) {

      var key = x + ',' + y;
      if (!this.popups[key]) this.popups[key] = [];

      var length = results.length;
      for (var i = 0; i < length; i++) {

        var data = results[i];
        var popup = this.createPopup(data);
        popup.data = data;
        this.popups[key].push(popup);
      }

      this.allPopupLength += length;
    }

    //ポップアップを作成

  }, {
    key: 'createPopup',
    value: function createPopup(data) {

      var content = L.DomUtil.create('div', 'popup');
      //content.innerHTML = data.title;

      var popup = L.popup({ autoPan: false, keepInView: true, autoClose: false, closeOnEscapeKey: false, closeOnClick: false }).setLatLng([Number(data.lat), Number(data.lng)]).setContent(content).openOn(this.map);

      var element = popup.getElement();

      //flickrだったら
      if (data.type == 'flickr') {

        var img = document.createElement('img');
        img.setAttribute('src', data.thumbnailSrc);
        content.appendChild(img);
        element.setAttribute('class', element.className + ' flickr');
      } else {
        //questionだったら

        this.addUserIcon(data.user_id, content);
        var span = document.createElement('span');
        span.innerHTML = data.title;
        content.appendChild(span);

        var rank = this.getRank(data);
        element.setAttribute('class', element.className + rank);
      }

      // var draggable = new L.Draggable(popup._container, popup._wrapper);
      // draggable.enable();

      L.DomEvent.on(element, 'click', this.popupClickHandler.bind(this, data));

      return popup;
    }
  }, {
    key: 'getRank',
    value: function getRank(data) {

      var rank = 'stateRank1';

      if (this.zoom < 6) {
        rank = ' ranker stateRank' + (data.state_rank + 1);
        if (data.state_rank == -1) rank = '';
      } else if (this.zoom < 14) {
        rank = ' ranker countryRank' + (data.country_rank + 1);
        if (data.country_rank == -1) rank = '';
      } else {
        rank = ' ranker cityRank' + (data.city_rank + 1);
        if (data.city_rank == -1) rank = '';
      }
      if (data.likes.length == 0) rank = '';

      return rank;
    }
  }, {
    key: 'addUserIcon',
    value: function addUserIcon(user_id, parent) {

      var img = new Image();
      var src = '/docs/user_icon/' + user_id + '.jpg';
      img.setAttribute('src', src);
      parent.appendChild(img);
      img.onerror = function (_img) {
        _img.setAttribute('src', '/docs/user_icon/no_image.jpg');
        _img.onerror = null;
      }.bind(this, img);

      return img;
    }
  }, {
    key: 'removePopups',
    value: function removePopups(x, y, allDeleteFlag) {

      if (allDeleteFlag) {
        for (var key in this.popups) {
          this.removeBoundsPopup(key);
        }
      } else {
        var key = x + ',' + y;
        if (!this.popups[key]) return;
        this.removeBoundsPopup(key);
      }
    }
  }, {
    key: 'removeBoundsPopup',
    value: function removeBoundsPopup(key) {

      var length = this.popups[key].length;
      for (var i = 0; i < length; i++) {
        //var content = this.popups[ key ][i].getContent();
        var element = this.popups[key][i].getElement();
        L.DomEvent.off(element, 'click', this.popupClickHandler.bind(this));
        this.popups[key][i].remove();
        this.allPopupLength--;
      }

      if (this.allPopupLength < 0) this.allPopupLength = 0;

      delete this.popups[key];
    }
  }, {
    key: 'popupClickHandler',
    value: function popupClickHandler(data) {

      this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'popupClick', data: data } } }));
    }
  }, {
    key: 'btnClickHandler',
    value: function btnClickHandler() {

      var bounds = this.map.getCenter();
      var zoom = this.map.getZoom();
      this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'newPost', lat: bounds.lat, lng: bounds.lng, zoom: zoom } } }));
    }

    //画面サイズに合ったlat lngの幅・高さを取得

  }, {
    key: 'getLatLngDist',
    value: function getLatLngDist() {

      var p = this.map.getPixelBounds();
      var minLatLng = this.map.unproject(p.min);
      var maxLatLng = this.map.unproject(p.max);

      console.log({ minLatLng: minLatLng, maxLatLng: maxLatLng });

      var x = maxLatLng.lng - minLatLng.lng;
      var y = minLatLng.lat - maxLatLng.lat;
      var latLngDist = { x: x, y: y };

      return latLngDist;
    }
  }, {
    key: 'setComment',
    value: function setComment(data) {

      var popup = this.getTargetPopup(data.question_id);
      popup.data.comments.push(data);
    }
  }, {
    key: 'setLike',
    value: function setLike(data) {

      var popup = this.getTargetPopup(data.question_id);
      popup.data.likes.push(data);
    }
  }, {
    key: 'getTargetPopup',
    value: function getTargetPopup(question_id) {

      var popup;

      for (var key in this.popups) {
        var popups = this.popups[key];
        var length = popups.length;
        for (var i = 0; i < length; i++) {
          if (question_id == popups[i].data.id) {
            popup = popups[i];
          }
        }
      }

      return popup;
    }
  }, {
    key: 'checkGps',
    value: function checkGps() {

      navigator.geolocation.getCurrentPosition(function (pos) {

        var latLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        console.log(latLng);

        if (this.userMaker) {

          this.userMaker.setLatLng(latLng);
        } else {
          //初回アクセス

          this.map.setZoomAround(latLng, 13);
          this.userMaker = L.marker([latLng.lat, latLng.lng]).addTo(this.map);
        }
      }.bind(this), function (error) {

        console.log(error);
        if (error.code == 1) {
          alert("位置情報の利用が許可されていません");
        }

        clearInterval(this.gpsIntervalId);
      }.bind(this), {
        enableHighAccuracy: true
      });
    }
  }, {
    key: 'resize',
    value: function resize() {

      this.width = this.element.clientWidth;
      this.height = this.element.clientHeight;
      this.halfWidth = this.width * 0.5;
      this.halfHeight = this.height * 0.5;

      this.latLngDist = this.getLatLngDist();

      this.allDelete();
    }
  }]);

  return Map;
}();

exports.default = Map;

},{"./Util":9}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Modal = function () {
  function Modal(expr) {
    _classCallCheck(this, Modal);

    this.element = document.querySelector(expr);
    this.inner = this.element.getElementsByClassName('inner')[0];
    this.closeBtn = document.querySelector(expr + ' .close_btn');
    this.closeBtn.addEventListener('click', this.hide.bind(this));

    this.htmlElement = document.getElementsByTagName('html')[0];

    this.hide();
  }

  _createClass(Modal, [{
    key: 'show',
    value: function show() {

      this.htmlElement.style.overflowY = 'hidden';

      this.element.style.display = 'block';
      setTimeout(function () {
        this.inner.style.transform = 'translateX(0%)';
      }.bind(this), 100);
    }
  }, {
    key: 'hide',
    value: function hide() {

      this.htmlElement.style.overflowY = 'auto';

      this.inner.style.transform = 'translateX(-100%)';
      setTimeout(function () {
        this.element.style.display = 'none';
      }.bind(this), 300);
    }
  }]);

  return Modal;
}();

exports.default = Modal;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Modal2 = require('./Modal');

var _Modal3 = _interopRequireDefault(_Modal2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _ImageManager = require('./ImageManager');

var _ImageManager2 = _interopRequireDefault(_ImageManager);

var _FileUploadManager = require('./FileUploadManager');

var _FileUploadManager2 = _interopRequireDefault(_FileUploadManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewPostModal = function (_Modal) {
    _inherits(NewPostModal, _Modal);

    function NewPostModal() {
        _classCallCheck(this, NewPostModal);

        var _this = _possibleConstructorReturn(this, (NewPostModal.__proto__ || Object.getPrototypeOf(NewPostModal)).call(this, '.modal.new'));

        _this.submitBtn = document.querySelector('.submit_btn');
        _this.submitBtn.addEventListener('click', _this.submit.bind(_this));

        _this.title = document.querySelector('#questionTitle');
        _this.content = document.querySelector('#questionContent');
        _this.lat = 0;
        _this.lng = 0;
        _this.zoom = 18;

        _this.fileUploadManager = new _FileUploadManager2.default('#fileContent', 200, 200, function (img) {
            this.uploadImage = img;
            this.photoContainer.style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
            this.photoContainer.style.display = 'inline-block';
        }.bind(_this), 'auto', false);
        _this.fileUploadManager.element.addEventListener('ysdCallback', _this.fileUploadManagerCallBackHandler.bind(_this));

        _this.photoContainer = document.querySelector('.file_selector .photo');
        _this.photoDeleteBtn = document.querySelector('.file_selector .photo .delete_btn');
        _this.photoDeleteBtn.addEventListener('click', _this.photoDeleteBtnClickHandler.bind(_this));

        _this.authenticity_token = document.getElementById('authenticity_token').value;

        _this.hide();

        return _this;
    }

    _createClass(NewPostModal, [{
        key: 'fileUploadManagerCallBackHandler',
        value: function fileUploadManagerCallBackHandler(e) {

            var obj = e.detail.value;
            switch (obj.type) {

                case 'readerLoadStart':
                    //this.loading.show();
                    break;

            }
        }
    }, {
        key: 'setLatLng',
        value: function setLatLng(lat, lng, zoom) {

            this.lat = lat;
            this.lng = lng;
            this.zoom = zoom;
        }
    }, {
        key: 'photoDeleteBtnClickHandler',
        value: function photoDeleteBtnClickHandler() {

            this.uploadImage = null;
            this.photoContainer.style.display = 'none';
        }
    }, {
        key: 'reverseGeocoding',
        value: function reverseGeocoding(callback) {}
    }, {
        key: 'submit',
        value: function submit() {

            if (this.loadFlag) return;

            var title = this.title.value;
            var content = this.content.value;
            if (title == '' || content == '') {
                alert('未入力の箇所があります');
                return;
            }

            var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + this.lat + '&lon=' + this.lng + '&zoom=' + this.zoom;
            $.ajax({
                url: url,
                type: 'GET',
                success: function (result) {
                    this.submitStep2(result);
                }.bind(this),
                error: function (result) {
                    console.log(result);
                }.bind(this)
            });
        }
    }, {
        key: 'submitStep2',
        value: function submitStep2(result) {

            var title = this.title.value;
            var content = this.content.value;

            var photoUrl = '';
            var formData = new FormData();
            if (this.uploadImage) {
                photoUrl = this.uploadImage.getAttribute('src');
                var blob = this.fileUploadManager.dataURLtoBlob(photoUrl);
                var name = this.fileUploadManager.file.name;
                name = name.split('.')[0] + '.jpg';
                formData.append('upfile', blob, name);
            }
            formData.append('title', title);
            formData.append('content', content);
            formData.append('lat', this.lat);
            formData.append('lng', this.lng);
            formData.append('user_id', app.user_id);
            formData.append('country', result.address.country);
            formData.append('state', result.address.state);
            formData.append('city', result.address.city);
            formData.append('authenticity_token', this.authenticity_token);

            var url = _Util2.default.apiHeadUrl + '/questions.json';
            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: this.uploadComp.bind(this, title, content, photoUrl),
                error: function (result) {
                    console.log(result);
                    this.loadFlag = false;
                    this.uploadImage = null;
                }.bind(this)
            });

            this.loadFlag = true;
            this.hide();
        }
    }, {
        key: 'uploadComp',
        value: function uploadComp(title, content, photoUrl, result) {

            this.loadFlag = false;
            this.uploadImage = null;
            this.fileUploadManager.fileInputRefresh();

            var data = {
                type: 'addPopup',
                title: title,
                content: content,
                lat: this.lat,
                lng: this.lng,
                photo: photoUrl,
                comments: []
            };
            this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: data } }));
        }
    }]);

    return NewPostModal;
}(_Modal3.default);

exports.default = NewPostModal;

},{"./FileUploadManager":1,"./ImageManager":2,"./Modal":5,"./Util":9}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Map = require('./Map');

var _Map2 = _interopRequireDefault(_Map);

var _NewPostModal = require('./NewPostModal');

var _NewPostModal2 = _interopRequireDefault(_NewPostModal);

var _ShowPostModal = require('./ShowPostModal');

var _ShowPostModal2 = _interopRequireDefault(_ShowPostModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener("DOMContentLoaded", function () {

  new Questions();
});

var Questions = function () {
  function Questions() {
    _classCallCheck(this, Questions);

    //document.addEventListener( "DOMContentLoaded", function(){
    this.newPostModal = new _NewPostModal2.default();
    this.newPostModal.element.addEventListener('ysdCallback', this.newPostModalCallBackHandler.bind(this));
    this.showPostModal = new _ShowPostModal2.default();
    this.showPostModal.element.addEventListener('ysdCallback', this.showPostModalCallBackHandler.bind(this));
    //}.bind( this ) );

    //   this.initMap();

    // }


    // initMap(){

    this.map = new _Map2.default();
    this.map.element.addEventListener('ysdCallback', this.mapCallBackHandler.bind(this));

    // var zoom = window.innerWidth / 750;
    // document.querySelector( 'header' ).style.zoom = zoom;
    //document.querySelector( '.main_content' ).style.zoom = zoom;
    // document.querySelector( 'footer' ).style.zoom = zoom;
    // document.querySelector( '.main_menu' ).style.zoom = zoom;

    this.resize();
    window.onresize = this.resize.bind(this);
  }

  _createClass(Questions, [{
    key: 'mapCallBackHandler',
    value: function mapCallBackHandler(e) {

      var obj = e.detail.value;
      switch (obj.type) {

        case 'popupClick':
          this.showPostModal.refresh();
          this.showPostModal.setText(obj.data);
          this.showPostModal.show();
          break;

        case 'newPost':
          this.newPostModal.setLatLng(obj.lat, obj.lng, obj.zoom);
          this.newPostModal.show();
          break;

      }
    }
  }, {
    key: 'newPostModalCallBackHandler',
    value: function newPostModalCallBackHandler(e) {

      var obj = e.detail.value;
      if (obj.type == 'addPopup') {
        this.map.createPopup(obj);
      }
    }
  }, {
    key: 'showPostModalCallBackHandler',
    value: function showPostModalCallBackHandler(e) {

      var obj = e.detail.value;
      if (obj.type == 'addComment') {
        this.map.setComment(obj.data);
      } else if (obj.type == 'addLike') {
        this.map.setLike(obj.data);
      }
    }
  }, {
    key: 'resize',
    value: function resize() {

      clearTimeout(this.resizeTimeOutId);
      this.resizeTimeOutId = setTimeout(function () {
        this.map.resize();
      }.bind(this), 100);
    }
  }]);

  return Questions;
}();

//var questions = new Questions();
//app.initMap = questions.initMap.bind( questions );

},{"./Map":4,"./NewPostModal":6,"./ShowPostModal":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Modal2 = require('./Modal');

var _Modal3 = _interopRequireDefault(_Modal2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _Loading = require('./Loading');

var _Loading2 = _interopRequireDefault(_Loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShowPostModal = function (_Modal) {
    _inherits(ShowPostModal, _Modal);

    function ShowPostModal() {
        _classCallCheck(this, ShowPostModal);

        var _this = _possibleConstructorReturn(this, (ShowPostModal.__proto__ || Object.getPrototypeOf(ShowPostModal)).call(this, '.modal.show'));

        _this.title = document.querySelector('.modal.show h2.title');
        _this.titleText = document.querySelector('.modal.show .title_text');
        _this.titleUserIconAtag = document.querySelector('.modal.show .title_user_icon a');
        _this.titleUserIcon;
        _this.photoContainer = document.querySelector('.modal.show .photo');
        _this.likeBtn = document.querySelector('.modal.show .like_btn');
        _this.likeBtn.addEventListener('click', _this.likeBtnClickHandler.bind(_this));
        _this.likeBtnCount = document.querySelector('.modal.show .like_btn .count');
        _this.content = document.querySelector('.modal.show .content');
        _this.comment = document.querySelector('.modal.show .comment');
        _this.comments = document.querySelector('.modal.show .comments');
        _this.answerBtn = document.querySelector('.modal.show .answer_btn');
        _this.answerBtn.addEventListener('click', _this.answerBtnClickHandler.bind(_this));

        _this.loading = new _Loading2.default();

        _this.authenticity_token = document.getElementById('authenticity_token').value;

        _this.hide();

        return _this;
    }

    //--------------------マウスイベント-------------------


    _createClass(ShowPostModal, [{
        key: 'likeBtnClickHandler',
        value: function likeBtnClickHandler() {

            var url = _Util2.default.apiHeadUrl + '/likes/create/' + this.questionId + '.json';
            var data = {
                question_id: this.questionId,
                user_id: app.user_id,
                authenticity_token: this.authenticity_token
            };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: data,
                success: this.postLikeComp.bind(this, data),
                error: function (result) {
                    console.log(result);
                }.bind(this)
            });

            //タップでいいねするポップを非表示にする
            document.getElementsByClassName('like_popup')[0].style.opacity = '0';
        }
    }, {
        key: 'postLikeComp',
        value: function postLikeComp(data, result) {

            console.log(result);
            this.likeBtnCount.innerHTML = Number(this.likeBtnCount.innerHTML) + 1;
            this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'addLike', data: data } } }));
        }
    }, {
        key: 'answerBtnClickHandler',
        value: function answerBtnClickHandler() {

            this.loading.show();

            var comment = this.comment.value;
            var question_id = this.questionId;
            var url = _Util2.default.apiHeadUrl + '/comments.json';
            var data = {
                content: comment,
                question_id: question_id,
                user_id: app.user_id,
                authenticity_token: this.authenticity_token
            };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: data,
                success: this.postAnswerComp.bind(this, data),
                error: function (result) {
                    console.log(result);
                    this.comment.value = '';
                    this.loading.hide();
                }.bind(this)
            });
        }
    }, {
        key: 'postAnswerComp',
        value: function postAnswerComp(data, result) {

            console.log(result);
            this.comment.value = '';
            this.loading.hide();
            this.addComment(data.content, app.user_id);
            this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'addComment', data: data } } }));

            var noComment = this.comments.getElementsByClassName('no_comment')[0];
            if (noComment) this.comments.removeChild(noComment);
        }

        //---------------------
        //質問タイトルと、質問テキストを配置

    }, {
        key: 'setText',
        value: function setText(data) {

            this.add(data);

            this.questionId = data.id;
        }
    }, {
        key: 'loadQuestion',
        value: function loadQuestion(id) {

            var url = _Util2.default.apiHeadUrl + '/questions/' + id;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (result) {
                    this.add(result);
                    this.loadFlag = false;
                }.bind(this),
                error: function (result) {
                    if (result.id != null) {
                        this.add(result);
                        this.loadFlag = false;
                    }
                }.bind(this)
            });
        }
    }, {
        key: 'add',
        value: function add(data) {

            if (data.type == 'flickr') {

                this.element.className = 'modal show flickr';
                this.photoContainer.innerHTML = '<img src="' + data.photo + '">';
                this.titleText.innerHTML = data.title;
            } else if (data.type == 'chiikinogennki' || data.type == 'yahoo') {

                this.element.className = 'modal show';

                this.titleText.innerHTML = data.title;
                if (data.photo) {
                    this.photoContainer.innerHTML = '<img src="' + data.photo + '">';
                }
                this.content.innerHTML = data.content;
            } else {

                this.element.className = 'modal show';

                this.titleText.innerHTML = data.title;
                this.titleUserIcon = this.addUserIcon(data.user_id, this.titleUserIconAtag);
                var url = '/users/' + data.user_id;
                this.titleUserIconAtag.setAttribute('href', url);

                if (data.photo) {
                    this.photoContainer.innerHTML = '<img src="' + data.photo + '">';
                }

                this.content.innerHTML = data.content;

                if (data.comments.length == 0) {
                    this.comments.innerHTML = '<li class="no_comment"><p>コメントがありません</p></li>';
                } else {
                    this.addComments(data.comments);
                }

                this.setLikeCount(data.likes);

                //sns
                var facebook = this.element.getElementsByClassName('facebook')[0];
                var twitter = this.element.getElementsByClassName('twitter')[0];
                var text = encodeURIComponent(data.content);
                var url = encodeURIComponent('http://hoge.jp');
                var href = 'http://twitter.com/share?text=' + text + '&amp;url=' + url;
                twitter.setAttribute('href', href);
                var line = this.element.getElementsByClassName('line')[0];
                href = 'https://social-plugins.line.me/lineit/share?url=' + url + '&amp;text=' + text;
                line.setAttribute('href', href);
            }
        }

        //コメント一覧を配置

    }, {
        key: 'addComments',
        value: function addComments(comments) {

            this.comments.innerHTML = '';
            var length = comments.length;
            for (var i = 0; i < length; i++) {
                var obj = comments[i];
                this.addComment(obj.content, obj.user_id);
            }
        }
    }, {
        key: 'addComment',
        value: function addComment(content, user_id) {

            var li = document.createElement('li');
            this.comments.appendChild(li);
            var a = document.createElement('a');
            li.appendChild(a);
            var url = '/users/' + user_id;
            a.setAttribute('href', url);
            this.addUserIcon(user_id, a);

            var p = document.createElement('p');
            p.innerHTML = content;
            li.appendChild(p);
        }
    }, {
        key: 'addUserIcon',
        value: function addUserIcon(user_id, parent) {

            var img = new Image();
            var src = '/docs/user_icon/' + user_id + '.jpg';
            img.setAttribute('src', src);
            parent.appendChild(img);
            img.onerror = function (_img) {
                _img.setAttribute('src', '/docs/user_icon/no_image.jpg');
            }.bind(this, img);

            return img;
        }
    }, {
        key: 'setLikeCount',
        value: function setLikeCount(likes) {

            if (!likes) return;

            this.likeBtnCount.innerHTML = likes.length;
        }
    }, {
        key: 'refresh',
        value: function refresh() {

            if (this.titleUserIcon) this.titleUserIconAtag.removeChild(this.titleUserIcon);
            this.titleText.innerHTML = '';
            this.photoContainer.innerHTML = '';
            this.content.innerHTML = '';
            this.likeBtnCount.innerHTML = '';
            this.comment.value = '';
            this.comments.innerHTML = '';
        }
    }]);

    return ShowPostModal;
}(_Modal3.default);

exports.default = ShowPostModal;

},{"./Loading":3,"./Modal":5,"./Util":9}],9:[function(require,module,exports){
'use strict';

module.exports = {

	ua: null,

	//apiHeadUrl : 'http://localhost:3000',
	apiHeadUrl: 'https://www.mappop.me'

};

},{}]},{},[7]);
