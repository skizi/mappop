(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var _Loading = require('./Loading');

var _Loading2 = _interopRequireDefault(_Loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditProfileModal = function (_Modal) {
    _inherits(EditProfileModal, _Modal);

    function EditProfileModal() {
        _classCallCheck(this, EditProfileModal);

        var _this = _possibleConstructorReturn(this, (EditProfileModal.__proto__ || Object.getPrototypeOf(EditProfileModal)).call(this, '.modal.edit_profile'));

        _this.enabledFlag = true;

        _this.changePhoto = _this.element.getElementsByClassName('change_photo')[0];
        _this.changeProfile = _this.element.getElementsByClassName('change_profile')[0];

        _this.changeBtn0 = _this.changePhoto.getElementsByClassName('change_type_btn')[0];
        _this.changeBtn0.addEventListener('click', _this.changeBtn0ClickHandler.bind(_this));
        _this.changeBtn1 = _this.changeProfile.getElementsByClassName('change_type_btn')[0];
        _this.changeBtn1.addEventListener('click', _this.changeBtn1ClickHandler.bind(_this));

        _this.hide();

        _this.reader = new FileReader();
        _this.imageManager = new _ImageManager2.default();

        _this.fileInput = document.getElementById('file_photo');
        _this.fileInput.addEventListener('change', _this.fileChangeHandler.bind(_this));
        _this.fileInput.addEventListener('click', _this.fileChangeClickHandler.bind(_this));

        _this.uploadBtn = _this.element.getElementsByClassName('photo_upload_btn')[0];
        _this.uploadBtn.addEventListener('click', _this.uploadBtnClickHandler.bind(_this));

        _this.photoContainer = document.querySelector('.photo_container .photo');

        _this.loading = new _Loading2.default();

        return _this;
    }

    _createClass(EditProfileModal, [{
        key: 'changeBtn0ClickHandler',
        value: function changeBtn0ClickHandler() {

            this.changePhoto.style.display = 'none';
            this.changeProfile.style.display = 'block';
        }
    }, {
        key: 'changeBtn1ClickHandler',
        value: function changeBtn1ClickHandler() {

            this.changePhoto.style.display = 'block';
            this.changeProfile.style.display = 'none';
        }
    }, {
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
        }
    }, {
        key: 'fileInputRefresh',
        value: function fileInputRefresh() {

            this.fileInput.value = '';
        }
    }, {
        key: 'uploadBtnClickHandler',
        value: function uploadBtnClickHandler() {

            if (!this.enabledFlag) return;
            if (this.fileInput.value == '') {
                alert('画像を選択して下さい');
                return;
            }

            if (this.loadFlag) {
                alert('画像アップロード中です。\nお待ちください。');
                return;
            }
            this.loading.show();
            this.loadFlag = true;

            this.reader.onload = function (e) {

                var img = new Image();
                img.setAttribute('src', this.reader.result);
                this.imageManager.fixExif(img, function (_img) {
                    this.upload(_img);
                    this.fileInputRefresh();
                }.bind(this));
            }.bind(this);
            this.reader.readAsDataURL(this.file);
        }
    }, {
        key: 'upload',
        value: function upload(img) {

            var formData = new FormData();
            var blob = this.dataURLtoBlob(img.getAttribute('src'));
            formData.append('upfile', blob, this.file.name);
            formData.append('id', document.getElementById('user_id').value);

            var url = _Util2.default.apiHeadUrl + '/users/upload_process.json';
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (result) {
                    this.uploadComp();
                }.bind(this),
                error: function (result) {
                    if (result.status == 200) {
                        this.uploadComp();
                    } else {
                        this.uploadComp('error');
                    }
                }.bind(this)
            });
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
    }, {
        key: 'uploadComp',
        value: function uploadComp(type) {

            if (type == 'error') {
                alert('アップロードエラー\n時間を置いてから試してみてください。');
            } else {

                setTimeout(function () {
                    this.hide();
                }.bind(this), 600);
                this.photoContainer.style.backgroundImage = 'url(' + this.reader.result + ')';

                this.enabledFlag = false;
                setTimeout(function () {
                    this.enabledFlag = true;
                }.bind(this), 900);
            }

            this.loadFlag = false;
            this.file = null;
            this.loading.hide();
        }
    }, {
        key: 'type',
        set: function set(_type) {

            this._type = _type;
            if (_type == 'profile') {
                this.changeBtn0ClickHandler();
            } else {
                this.changeBtn1ClickHandler();
            }
        }
    }]);

    return EditProfileModal;
}(_Modal3.default);

exports.default = EditProfileModal;

},{"./ImageManager":2,"./Loading":3,"./Modal":4,"./Util":6}],2:[function(require,module,exports){
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
    function ImageManager() {
        _classCallCheck(this, ImageManager);

        this.resizeWidth = 200;
        this.resizeHeight = 200;

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

},{"./Util":6}],3:[function(require,module,exports){
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

},{"./Util":6}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EditProfileModal = require('./EditProfileModal');

var _EditProfileModal2 = _interopRequireDefault(_EditProfileModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener("DOMContentLoaded", function () {

  new Profile();
});

var Profile = function () {
  function Profile() {
    _classCallCheck(this, Profile);

    this.editPhotoBtn = document.querySelector('.photo_container .photo');
    this.editPhotoBtn.addEventListener('click', this.editPhotoBtnClickHandler.bind(this));

    this.editBtn = document.getElementsByClassName('edit_profile_btn')[0];
    this.editBtn.addEventListener('click', this.editBtnClickHandler.bind(this));
    this.editProfileModal = new _EditProfileModal2.default();

    this.about = document.querySelector('.main_content p.about');
    this.adjustAboutText();
  }

  _createClass(Profile, [{
    key: 'editPhotoBtnClickHandler',
    value: function editPhotoBtnClickHandler() {

      this.editProfileModal.type = 'photo';
      this.editProfileModal.show();
    }
  }, {
    key: 'editBtnClickHandler',
    value: function editBtnClickHandler() {

      this.editProfileModal.type = 'profile';
      this.editProfileModal.show();
    }

    //プロフィール文の整形
    //一行18文字以内、各行をspanで囲む

  }, {
    key: 'adjustAboutText',
    value: function adjustAboutText() {

      //改行が３回以上の場合は３行目に全て連結する
      var strs = this.about.innerHTML.split('\n');
      if (!strs[1]) strs[1] = '';
      if (!strs[2]) strs[2] = '';
      if (strs.length > 3) {
        for (var i = 3; i < strs.length; i++) {
          strs[2] += strs[i];
        }
      }

      //一行に18文字以上の場合は次の行に加える
      var cacheStr = '';
      for (var i = 0; i < 3; i++) {
        strs[i] = cacheStr + strs[i];
        if (strs[i].length > 18 && i != 2) {
          cacheStr = strs[i];
          cacheStr = cacheStr.slice(17);
          strs[i] = strs[i].slice(0, 17);
        }
      }

      //一行に18文字以上の場合は前の行に加える
      cacheStr = '';
      for (i = 2; i > -1; i--) {
        strs[i] = strs[i] + cacheStr;
        if (strs[i].length > 18) {
          cacheStr = strs[i];
          cacheStr = cacheStr.slice(0, strs[i].length - 18);
          strs[i] = strs[i].slice(strs[i].length - 18);
        }
      }

      //文字を改行ごとにspanで囲む
      var html = '';
      for (var i = 0; i < 3; i++) {
        var str = '<span>' + strs[i] + '</span>';
        if (i != 2) str = str + '<br>';
        html += str;
      }
      this.about.innerHTML = html;
    }
  }]);

  return Profile;
}();

},{"./EditProfileModal":1}],6:[function(require,module,exports){
'use strict';

module.exports = {

	apiHeadUrl: 'http://localhost:3000'
	//apiHeadUrl : 'http://160.16.62.37:8080'

};

},{}]},{},[5]);
