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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditProfileModal = function (_Modal) {
    _inherits(EditProfileModal, _Modal);

    function EditProfileModal() {
        _classCallCheck(this, EditProfileModal);

        // this.name = document.querySelector( '.modal.edit_profile .name' );
        // this.location = document.querySelector( '.modal.edit_profile .location' );
        // this.about = document.querySelector( '.modal.edit_profile .about' );
        // this.submitBtn = document.querySelector( '.modal.edit_profile .submit_btn' );
        // this.submitBtn.addEventListener( 'click', this.submitBtnClickHandler.bind( this ) );

        var _this = _possibleConstructorReturn(this, (EditProfileModal.__proto__ || Object.getPrototypeOf(EditProfileModal)).call(this, '.modal.edit_profile'));

        _this.changePhoto = _this.element.getElementsByClassName('change_photo')[0];
        _this.changeProfile = _this.element.getElementsByClassName('change_profile')[0];

        _this.changeBtn0 = _this.changePhoto.getElementsByClassName('change_type_btn')[0];
        _this.changeBtn0.addEventListener('click', _this.changeBtn0ClickHandler.bind(_this));
        _this.changeBtn1 = _this.changeProfile.getElementsByClassName('change_type_btn')[0];
        _this.changeBtn1.addEventListener('click', _this.changeBtn1ClickHandler.bind(_this));

        _this.hide();

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

        //--------------------マウスイベント-------------------
        // submitBtnClickHandler(){

        //     var name = this.name.value;
        //     var location = this.location.value;
        //     var about = this.about.value;
        //     var url = Util.apiHeadUrl + '/comments.json';
        //     $.ajax({
        //         url:url,
        //         type:'POST',
        //         data:{ content:comment, question_id:question_id, user_id:0 },
        //         success:function( result ){
        //           console.log( result );
        //         },
        //         error:function( result ){
        //           console.log( result );
        //         }.bind( this )
        //     });
        // }

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

},{"./Modal":2,"./Util":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
  }]);

  return Profile;
}();

},{"./EditProfileModal":1}],4:[function(require,module,exports){
'use strict';

module.exports = {

	apiHeadUrl: 'http://localhost:3000'

};

},{}]},{},[3]);
