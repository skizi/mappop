(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MainMenu = require('./MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener("DOMContentLoaded", function () {
		new Common();
});

var Common = function () {
		function Common() {
				_classCallCheck(this, Common);

				this.mainMenuBtn = document.getElementsByClassName('main_menu_btn')[0];
				this.mainMenuBtn.addEventListener('click', this.mainMenuBtnClickHandler.bind(this));
				this.mainMenu = new _MainMenu2.default();

				//拡大禁止
				// var inputs = document.getElementsByTagName( 'input' );
				// for( var i = 0; i < inputs.length; i++ ){
				// 	if( inputs[i].getAttribute( 'type' ) == 'text' ){
				// 		inputs[i].addEventListener('touchstart', event => {
				// 			event.preventDefault();
				// 		}, false);
				// 	}
				// }

				// var textareas = document.getElementsByTagName( 'textarea' );
				// for( var i = 0; i < textareas.length; i++ ){
				// 	textareas[i].addEventListener('touchstart', event => {
				// 		event.preventDefault();
				// 	}, false);
				// }

				if (window.innerWidth < 375) {
						var wrapper = document.getElementsByClassName('wrapper')[0];
						wrapper.style.zoom = window.innerWidth / 375;
				}
		}

		_createClass(Common, [{
				key: 'mainMenuBtnClickHandler',
				value: function mainMenuBtnClickHandler() {

						this.mainMenu.show();
				}
		}]);

		return Common;
}();

},{"./MainMenu":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MainMenu = function () {
  function MainMenu() {
    _classCallCheck(this, MainMenu);

    this.element = document.getElementsByClassName('main_menu')[0];
    this.closeBtn = this.element.getElementsByClassName('close_btn')[0];
    this.closeBtn.addEventListener('click', this.closeBtnClickHandler.bind(this));
    this.bg = this.element.getElementsByClassName('bg')[0];
    this.bg.addEventListener('click', this.closeBtnClickHandler.bind(this));
  }

  _createClass(MainMenu, [{
    key: 'show',
    value: function show() {

      this.element.style.transform = 'translateX(0%)';
    }
  }, {
    key: 'hide',
    value: function hide() {

      this.element.style.transform = 'translateX(-100%)';
    }
  }, {
    key: 'closeBtnClickHandler',
    value: function closeBtnClickHandler() {

      this.hide();
    }
  }]);

  return MainMenu;
}();

exports.default = MainMenu;

},{}]},{},[1]);
