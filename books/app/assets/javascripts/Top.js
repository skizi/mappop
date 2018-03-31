(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener("DOMContentLoaded", function () {

  new Top();
});

var Top = function Top() {
  _classCallCheck(this, Top);

  var latlng = [35.67848924554223, 139.76272863769532];
  var opsion = {
    zoomControl: false,
    dragging: false,
    doubleClickZoom: false,
    boxZoom: false,
    scrollWheelZoom: false
  };
  this.map = L.map('leafletMap', opsion).setView(latlng, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

  //なぜかRetina対応タイルが存在しない
  //'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png',
  {
    attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
    minZoom: 3,
    maxZoom: 18
    //detectRetina:true
  }).addTo(this.map);
};

},{}]},{},[1]);
