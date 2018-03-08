(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener("DOMContentLoaded", function () {

  new Signup();
});

var Signup = function () {
  function Signup() {
    _classCallCheck(this, Signup);

    this.nortice = document.querySelector('.signup_container .notice');

    this.email = document.getElementById('user_email');
    this.password = document.getElementById('user_password');
    this.name = document.getElementById('user_name');
    this.subMitBtn = document.getElementsByClassName('submit_btn0')[0];
    this.subMitBtn.addEventListener('click', this.subMitBtnClickHandler.bind(this));
  }

  _createClass(Signup, [{
    key: 'subMitBtnClickHandler',
    value: function subMitBtnClickHandler(e) {

      var errorMessage = '';

      if (this.email.value == '') errorMessage += 'メールアドレスが入力されていません。<br>';
      if (this.password.value == '') errorMessage += 'パスワードが入力されていません。<br>';
      if (this.name.value == '') errorMessage += '名前が入力されていません。';

      if (errorMessage != '') {
        this.nortice.innerHTML = errorMessage;
        e.preventDefault();
      }
    }
  }]);

  return Signup;
}();

},{}]},{},[1]);
