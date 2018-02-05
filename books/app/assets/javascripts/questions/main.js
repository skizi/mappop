(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MainMenu = require('./MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

var _Map = require('./Map');

var _Map2 = _interopRequireDefault(_Map);

var _NewPostModal = require('./NewPostModal');

var _NewPostModal2 = _interopRequireDefault(_NewPostModal);

var _ShowPostModal = require('./ShowPostModal');

var _ShowPostModal2 = _interopRequireDefault(_ShowPostModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
  function Main() {
    _classCallCheck(this, Main);

    window.onready = function () {
      new _MainMenu2.default();
      this.newPostModal = new _NewPostModal2.default();
      this.showPostModal = new _ShowPostModal2.default();
    }.bind(this);
  }

  _createClass(Main, [{
    key: 'initMap',
    value: function initMap() {

      this.map = new _Map2.default();
      this.map.initMap();
      this.map.element.addEventListener('ysdCallback', this.mapCallBackHandler.bind(this));
    }
  }, {
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

  return Main;
}();

var main = new Main();
app.initMap = main.initMap.bind(main);

},{"./MainMenu":2,"./Map":3,"./NewPostModal":5,"./ShowPostModal":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MainMenu = function MainMenu() {
  _classCallCheck(this, MainMenu);
};

exports.default = MainMenu;

},{}],3:[function(require,module,exports){
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

    this.map = new google.maps.Map(this.element, {
      center: { lat: 35.67848924554223, lng: 139.76272863769532 },
      zoom: 12
    });

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
        var content = document.createElement("div");
        content.className = 'popup';
        content.innerHTML = obj.title;
        var popup = new google.maps.InfoWindow({
          content: content,
          position: { lat: Number(obj.lat), lng: Number(obj.lng) },
          map: this.map,
          disableAutoPan: false
        });
        this.popups.push(popup);

        google.maps.event.addDomListener(content, 'click', this.popupClickHandler.bind(this, i));
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
      this.element.dispatchEvent(new CustomEvent('ysdCallback', { detail: { value: { type: 'newPost', lat: bounds.lat(), lng: bounds.lng() } } }));
    }
  }]);

  return Map;
}();

exports.default = Map;

},{"./Util":7}],4:[function(require,module,exports){
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
    this.closeBtn = document.querySelector(expr + ' .close_btn');
    this.closeBtn.addEventListener('click', this.hide.bind(this));
    this.hide();
  }

  _createClass(Modal, [{
    key: 'show',
    value: function show() {

      this.element.style.display = 'block';
    }
  }, {
    key: 'hide',
    value: function hide() {

      this.element.style.display = 'none';
    }
  }]);

  return Modal;
}();

exports.default = Modal;

},{}],5:[function(require,module,exports){
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
          user_id: 0
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

},{"./Modal":4,"./Util":7}],6:[function(require,module,exports){
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

    _this.hide();

    return _this;
  }

  _createClass(ShowPostModal, [{
    key: 'setText',
    value: function setText(title, content, questionId, comments) {

      this.title.innerHTML = title;
      this.content.innerHTML = content;
      this.questionId = questionId;
      this.addComments(comments);
      // var url = Util.apiHeadUrl + '/comments/get_comments/' + questionId + '.json';
      // $.ajax({
      //     url:url,
      //     type:'GET',
      //     data:{},
      //     success:function( results ){
      //       console.log( results );
      //       this.addComments( results );
      //     }.bind( this ),
      //     error:function( result ){
      //       console.log( result );
      //     }.bind( this )
      // });
    }
  }, {
    key: 'answerBtnClickHandler',
    value: function answerBtnClickHandler() {

      var comment = this.comment.value;
      var question_id = this.questionId;
      var url = _Util2.default.apiHeadUrl + '/comments.json';
      $.ajax({
        url: url,
        type: 'POST',
        data: { content: comment, question_id: question_id, user_id: 0 },
        success: function success(result) {
          console.log(result);
        },
        error: function (result) {
          console.log(result);
        }.bind(this)
      });
    }
  }, {
    key: 'addComments',
    value: function addComments(comments) {

      var html = "";
      var length = comments.length;
      for (var i = 0; i < length; i++) {
        var obj = comments[i];
        if (obj.user_id) {
          var src = '/docs/user_icon/' + obj.user_id + '.jpg';
        } else {
          src = '/docs/user_icon/no_image.jpg';
        }

        html += '<li><img src="' + src + '" width="30">' + obj.content + '</li>';
      }
      this.comments.innerHTML = html;
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

},{"./Modal":4,"./Util":7}],7:[function(require,module,exports){
'use strict';

module.exports = {

	apiHeadUrl: 'http://localhost:3000'

};

},{}]},{},[1]);
