(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Util":7}],2:[function(require,module,exports){
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
        var content = L.DomUtil.create('div', 'popup');
        content.innerHTML = obj.title;
        L.DomEvent.on(content, 'click', this.popupClickHandler.bind(this, i));

        var popup = L.popup().setLatLng([Number(obj.lat), Number(obj.lng)]).setContent(content).openOn(this.map);
        this.popups.push(popup);

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
  }]);

  return Map;
}();

exports.default = Map;

},{"./Util":7}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Modal2 = require('./Modal');

var _Modal3 = _interopRequireDefault(_Modal2);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

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

    _this.title = document.querySelector('.modal.new .title');
    _this.content = document.querySelector('.modal.new .content');
    _this.lat = 0;
    _this.lng = 0;

    _this.hide();

    return _this;
  }

  _createClass(NewPostModal, [{
    key: 'submit',
    value: function submit() {

      if (this.loadFlag) return;

      var title = this.title.value;
      var content = this.content.value;
      if (title == '' || content == '') {
        alert('未入力の箇所があります');
        return;
      }

      var url = _Util2.default.apiHeadUrl + '/questions.json';
      $.ajax({
        url: url,
        type: 'POST',
        // xhrFields: {
        //   withCredentials: true
        // },
        data: {
          title: title,
          content: content,
          lat: this.lat,
          lng: this.lng,
          user_id: app.user_id
        },
        success: function (result) {
          console.log(result);
          this.loadFlag = false;
        }.bind(this),
        error: function (result) {
          console.log(result);
          this.loadFlag = false;
        }.bind(this)
      });

      this.loadFlag = true;
      this.hide();
    }
  }]);

  return NewPostModal;
}(_Modal3.default);

exports.default = NewPostModal;

},{"./Modal":3,"./Util":7}],5:[function(require,module,exports){
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
          this.showPostModal.setText(obj.data.title, obj.data.content, obj.data.id, obj.data.comments);
          this.showPostModal.show();
          break;

        case 'newPost':
          this.newPostModal.lat = obj.lat;
          this.newPostModal.lng = obj.lng;
          this.newPostModal.show();
          break;

      }
    }
  }]);

  return Questions;
}();

//var questions = new Questions();
//app.initMap = questions.initMap.bind( questions );

},{"./Map":2,"./NewPostModal":4,"./ShowPostModal":6}],6:[function(require,module,exports){
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

        _this.title = document.querySelector('.modal.show .title');
        _this.content = document.querySelector('.modal.show .content');
        _this.comment = document.querySelector('.modal.show .comment');
        _this.comments = document.querySelector('.modal.show .comments');
        _this.answerBtn = document.querySelector('.modal.show .answer_btn');
        _this.answerBtn.addEventListener('click', _this.answerBtnClickHandler.bind(_this));

        _this.loading = new _Loading2.default();

        _this.hide();

        return _this;
    }

    //--------------------マウスイベント-------------------


    _createClass(ShowPostModal, [{
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
        value: function setText(title, content, questionId, comments) {

            this.title.innerHTML = title;
            this.content.innerHTML = content;
            this.questionId = questionId;

            if (comments.length == 0) {
                this.comments.innerHTML = '<li><p class="no_comment">コメントがありません</p></li>';
            } else {
                this.addComments(comments);
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
        key: 'refresh',
        value: function refresh() {

            this.comment.value = '';
            this.comments.innerHTML = '';
        }
    }]);

    return ShowPostModal;
}(_Modal3.default);

exports.default = ShowPostModal;

},{"./Loading":1,"./Modal":3,"./Util":7}],7:[function(require,module,exports){
'use strict';

module.exports = {

	//apiHeadUrl : 'http://localhost:3000'
	apiHeadUrl: 'http://160.16.62.37:8080'

};

},{}]},{},[5]);
