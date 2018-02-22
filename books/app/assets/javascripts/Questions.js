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

            if (this.type == 'auto') this.readFile();
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
            this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'readerLoadStart' } } }));

            this.reader.onload = function (e) {

                var img = new Image();
                img.setAttribute('src', this.reader.result);
                this.imageManager.fixExif(img, function (_img) {
                    this.loadFlag = false;
                    if (this.autoRefreshFlag) this.fileInputRefresh();
                    this.callback(_img);
                }.bind(this));
            }.bind(this);
            this.reader.readAsDataURL(this.file);
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

    var latlng = [35.67848924554223, 139.76272863769532];
    this.map = L.map('leafletMap').setView(latlng, 12);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    //なぜかRetina対応タイルが存在しない
    //'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png',
    {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18
      //detectRetina:true
    }).addTo(this.map);

    this.popups = [];
  }

  _createClass(Map, [{
    key: 'initMap',
    value: function initMap() {

      var url = _Util2.default.apiHeadUrl + '/questions/all.json';
      $.ajax({
        url: url,
        type: 'GET',
        data: {},
        success: this.jsonLoadComp.bind(this),
        error: function (result) {
          console.log(result);
        }.bind(this)
      });
    }
  }, {
    key: 'jsonLoadComp',
    value: function jsonLoadComp(results) {

      this.results = results;
      var length = results.length;
      for (var i = 0; i < length; i++) {
        var obj = results[i];

        //google map
        // var content = document.createElement("div");
        // content.className = 'popup';
        // content.innerHTML = obj.title;
        // var popup = new google.maps.InfoWindow({
        // 	content: content,
        // 	position: { lat:Number( obj.lat ), lng:Number( obj.lng ) },
        // 	map: this.map,
        // 	disableAutoPan: false
        // });

        //leaflet
        this.addPopup(obj.title, obj.lat, obj.lng, i);

        //google.maps.event.addDomListener( content,'click', this.popupClickHandler.bind( this, i ));
      }
    }
  }, {
    key: 'popupClickHandler',
    value: function popupClickHandler(index) {

      this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'popupClick', data: this.results[index] } } }));
    }
  }, {
    key: 'btnClickHandler',
    value: function btnClickHandler() {

      var bounds = this.map.getCenter();
      this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'newPost', lat: bounds.lat, lng: bounds.lng } } }));
    }
  }, {
    key: 'addPopup',
    value: function addPopup(title, lat, lng, i) {

      if (i == null) i = this.popups.length;

      var content = L.DomUtil.create('div', 'popup');
      content.innerHTML = title;
      L.DomEvent.on(content, 'click', this.popupClickHandler.bind(this, i));

      var popup = L.popup({ autoPan: false, keepInView: true, autoClose: false, closeOnEscapeKey: false }).setLatLng([Number(lat), Number(lng)]).setContent(content).openOn(this.map);
      this.popups.push(popup);
    }
  }, {
    key: 'pushData',
    value: function pushData(data) {

      this.results.push(data);
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
    this.bg = this.element.getElementsByClassName('bg')[0];
    this.bg.addEventListener('click', this.hide.bind(this));
    this.closeBtn = document.querySelector(expr + ' .close_btn');
    this.closeBtn.addEventListener('click', this.hide.bind(this));
    this.hide();
  }

  _createClass(Modal, [{
    key: 'show',
    value: function show() {

      this.element.style.display = 'block';
      setTimeout(function () {
        this.element.style.opacity = 1;
      }.bind(this), 100);
      setTimeout(function () {
        this.inner.style.opacity = 1;
        this.inner.style.transform = 'translateY(0px)';
      }.bind(this), 400);
    }
  }, {
    key: 'hide',
    value: function hide() {

      this.inner.style.opacity = 0;
      this.inner.style.transform = 'translateY(-20px)';
      setTimeout(function () {
        this.element.style.opacity = 0;
      }.bind(this), 300);
      setTimeout(function () {
        this.element.style.display = 'none';
      }.bind(this), 600);
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

        _this.fileUploadManager = new _FileUploadManager2.default('#fileContent', 200, 200, function (img) {
            this.uploadImage = img;
        }.bind(_this), 'auto', false);
        _this.fileUploadManager.element.addEventListener('ysdCallback', _this.fileUploadManagerCallBackHandler.bind(_this));

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
        value: function setLatLng(lat, lng) {

            this.lat = lat;
            this.lng = lng;
        }
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
    //}.bind( this ) );

    //   this.initMap();

    // }


    // initMap(){

    this.map = new _Map2.default();
    this.map.initMap();
    this.map.element.addEventListener('ysdCallback', this.mapCallBackHandler.bind(this));

    // var zoom = window.innerWidth / 750;
    // document.querySelector( 'header' ).style.zoom = zoom;
    //document.querySelector( '.main_content' ).style.zoom = zoom;
    // document.querySelector( 'footer' ).style.zoom = zoom;
    // document.querySelector( '.main_menu' ).style.zoom = zoom;
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
          this.newPostModal.setLatLng(obj.lat, obj.lng);
          this.newPostModal.show();
          break;

      }
    }
  }, {
    key: 'newPostModalCallBackHandler',
    value: function newPostModalCallBackHandler(e) {

      var obj = e.detail.value;
      if (obj.type == 'addPopup') {
        this.map.addPopup(obj.title, obj.lat, obj.lng);
        this.map.pushData(obj);
      }
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

        _this.title = document.querySelector('.modal.show .title .title_text');
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

        _this.hide();

        return _this;
    }

    _createClass(ShowPostModal, [{
        key: 'show',
        value: function show() {

            this.element.style.display = 'block';
            setTimeout(function () {
                this.inner.style.transform = 'translateX(0%)';
            }.bind(this), 100);
        }
    }, {
        key: 'hide',
        value: function hide() {

            this.inner.style.transform = 'translateX(-100%)';
            setTimeout(function () {
                this.element.style.display = 'none';
            }.bind(this), 300);
        }

        //--------------------マウスイベント-------------------

    }, {
        key: 'likeBtnClickHandler',
        value: function likeBtnClickHandler() {

            var url = _Util2.default.apiHeadUrl + '/likes.json';
            var data = {
                question_id: this.questionId,
                user_id: app.user_id
            };
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                success: function (result) {
                    console.log(result);
                    this.likeBtnCount.innerHTML = Number(this.likeBtnCount.innerHTML) + 1;
                }.bind(this),
                error: function (result) {
                    console.log(result);
                    if (result.question_id) {
                        this.likeBtnCount.innerHTML = Number(this.likeBtnCount.innerHTML) + 1;
                    }
                }.bind(this)
            });
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
                user_id: app.user_id
            };
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                success: function (result) {
                    console.log(result);
                    this.comment.value = '';
                    this.loading.hide();
                }.bind(this),
                error: function (result) {
                    console.log(result);
                    this.comment.value = '';
                    this.loading.hide();
                }.bind(this)
            });

            var noComment = this.comments.getElementsByClassName('no_comment')[0];
            if (noComment) this.comments.removeChild(noComment);

            this.addComment(comment, app.user_id);
        }

        //---------------------

        //質問タイトルと、質問テキストを配置

    }, {
        key: 'setText',
        value: function setText(data) {

            this.loadQuestion(data.id);
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
                }.bind(this),
                error: function (result) {
                    if (result.id != null) {
                        this.add(result);
                    }
                }.bind(this)
            });
        }
    }, {
        key: 'add',
        value: function add(data) {

            this.title.innerHTML = data.title;
            if (data.photo) this.photoContainer.innerHTML = '<img src="' + data.photo + '">';
            this.content.innerHTML = data.content;
            this.questionId = data.id;

            if (data.comments.length == 0) {
                this.comments.innerHTML = '<li><p class="no_comment">コメントがありません</p></li>';
            } else {
                this.addComments(data.comments);
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

            var img = new Image();
            var src = '/docs/user_icon/' + user_id + '.jpg';
            img.setAttribute('src', src);
            li.appendChild(img);
            img.onerror = function (_img) {
                _img.setAttribute('src', '/docs/user_icon/no_image.jpg');
            }.bind(this, img);

            var p = document.createElement('p');
            p.innerHTML = content;
            li.appendChild(p);
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

	//apiHeadUrl : 'http://localhost:3000',
	apiHeadUrl: 'http://160.16.62.37:8080'

};

},{}]},{},[7]);
