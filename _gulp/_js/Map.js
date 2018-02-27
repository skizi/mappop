
import Util from './Util';


export default class Map{

  constructor(){

  	this.element = document.querySelector( '.map_container .map' );
  	this.btn = document.querySelector( '.map_container .btn0' );
  	this.btn.addEventListener( 'click', this.btnClickHandler.bind( this ) );

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

    var latlng = [ 35.67848924554223, 139.76272863769532];
    this.map = L.map( 'leafletMap' ).setView( latlng, 12 );
  	L.tileLayer(
  		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

  		//なぜかRetina対応タイルが存在しない
  		//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png',
  		{
  			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
        minZoom: 3,
  			maxZoom: 18,
  			//detectRetina:true
  		}
  	).addTo( this.map );

    //移動範囲を限定させる
    this.map.setMaxBounds( new L.LatLngBounds([ -90, -180 ], [ 90, 180]) );

    this.popups = {};


    this.oldIndexs = [];
    this.map.on( 'moveend', this.mapMoved.bind( this ) );
    // this.map.on( 'load', function(){
    // }.bind( this ) );

    window.onload = this.checkNewQuestions.bind( this );

  }


  mapMoved(){

    this.checkNewQuestions();

  }


  checkNewQuestions(){

    var c = this.map.getCenter();
    var now = this.getSplitAreaId( c.lat, c.lng );
    var hasFlag = this.hasOldIndex( now );
    console.log( now.x, now.y );
    if( !hasFlag ){
      this.getQuestions( now.minLatLng, now.maxLatLng, this.jsonLoadComp.bind( this, now.x, now.y ) );//debug
      this.oldIndexs.push( { x:now.x, y:now.y } );
    }
    
    //２マスはなれたポップアップたちを削除
    var length = this.oldIndexs.length;
    for( var i = length-1; i > -1; i-- ){
      var old = this.oldIndexs[i];
      var distX = Math.abs( old.x - now.x );
      var distY = Math.abs( old.y - now.y );
      if( distX + distY > 1 ){
        console.log( "remove!" + old.x + ',' + old.y );
        this.removePopups( old.x, old.y );
        this.oldIndexs.splice( i, 1 );
      }
    }

  }


  hasOldIndex( now ){
    
    var flag = false;
    var length = this.oldIndexs.length;
    for( var i = 0; i < length; i++ ){
      if( this.oldIndexs[i].x == now.x && this.oldIndexs[i].y == now.y ){
        flag = true;
      }
    }

    return flag;

  }


  //地図全体を升目で区切り
  //latとlngとzoomレベルからから升目のxとyのindex番号を取得する
  getSplitAreaId( lat, lng ){

    //↓モニターに写っている領域の全体からみたパーセンテージ
    //var perX = ( モニターのmaxLat - モニターのminLat ) / 180
    //
    //↓地図を何文割するかの数値
    //var lengthX = 180 / ( モニターのmaxLat - モニターのminLat )
    //var lengthY = 360 / ( モニターのmaxLng - モニターのminLng )

    //ただ、モニターのサイズはデバイスによって違うので、
    //ここでのモニターのサイズは固定で定義するべき 1000 * 1000　ぐらい・・・？

    var p = this.map.getPixelBounds();
    p.min.x += this.halfWidth - this.searchRadius;
    p.min.y += this.halfHeight - this.searchRadius;
    p.max.x = p.max.x - this.halfWidth + this.searchRadius;
    p.max.y = p.max.y - this.halfHeight + this.searchRadius;
    var minLatLng = this.map.unproject( p.min );
    var maxLatLng = this.map.unproject( p.max );

    var perX = ( lng + 180 ) / 360;
    var perY = ( lat + 90 ) / 180;
    var lengthX = 360 / ( maxLatLng.lng - minLatLng.lng );
    var lengthY = 180 / ( minLatLng.lat - maxLatLng.lat );

    //各倍率のlengthX, lengthYをクライアントの配列に全て保持し、
    //フキダシのlat lngのみサーバーに保存

    //現在のマップの中心地が入る升目を調べ
    //その 升目のminとmaxの間に含まれるフキダシを全て表示


    // this.addPopup( 'topLeft', minLatLng.lat, minLatLng.lng, 9999 );
    // this.addPopup( 'bottomRight', maxLatLng.lat, maxLatLng.lng, 9999 );

    var x = Math.floor(lengthX * perX );
    if( x == lengthX ) x = lengthX - 1;

    var y = Math.floor( lengthY * perY );
    if( y == lengthY ) y = lengthY - 1;

    if( lat < -90 ) y = 0;
    if( lat > 90 ) y = lengthY - 1;
    if( lng < -180 ) x = 0;
    if( lng > 180 ) x = lengthX - 1;


    return { x:x, y:y, minLatLng:minLatLng, maxLatLng:maxLatLng };

  }


  getQuestions( min, max, callback ){

    var data = {
      min_lat:min.lat,
      max_lat:max.lat,
      min_lng:min.lng,
      max_lng:max.lng
    };

    var url = Util.apiHeadUrl + '/questions/search_lat_lng.json';
    $.ajax({
        url:url,
        type:'GET',
        data:data,
        success:function( _callback, result ){
          _callback( result );
        }.bind( this, callback ),
        error:function( _callback, result ){
          if( result && result.length ) _callback( result );
        }.bind( this, callback )
    });

  }


  jsonLoadComp( x, y, results ){

    var key = x + ',' + y;
    this.popups[ key ] = [];

  	this.questions = results;
  	var length = results.length;
  	for( var i = 0; i < length; i++ ){
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
      var popup = this.createPopup( obj.title, obj.lat, obj.lng, i );
      this.popups[ key ].push( popup );
		  //google.maps.event.addDomListener( content,'click', this.popupClickHandler.bind( this, i ));
  	}
console.log( "add!:" + key );
  }


  createPopup( title, lat, lng, i ){

    var content = L.DomUtil.create( 'div', 'popup' );
    content.innerHTML = title;
    L.DomEvent.on( content, 'click', this.popupClickHandler.bind( this, i ) );

    var popup = L.popup({ autoPan:false, keepInView:true, autoClose:false, closeOnEscapeKey:false, closeOnClick:false })
        .setLatLng([ Number( lat ), Number( lng ) ])
        .setContent( content )
        .openOn( this.map );

    return popup;

  }


  removePopups( x, y ){

    var key = x + ',' + y;
    var length = this.popups[ key ].length;
    for( var i = 0; i < length; i++ ){
      var content = this.popups[ key ][i].getContent();
      L.DomEvent.off( content, 'click', this.popupClickHandler.bind( this ) );
      this.popups[ key ][i].remove();
    }

    this.popups[ key ] = null;

  }


  popupClickHandler( index ){

	 this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'popupClick', data:this.questions[index] } } } ) );

  }


  btnClickHandler(){

    var bounds = this.map.getCenter();

//console.log( this.map.getZoom() );

  	this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'newPost', lat:bounds.lat, lng:bounds.lng } } } ) );

  }


  pushData( data ){

    this.questions.push( data );

  }


  resize(){
    
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;
    this.halfWidth = this.width * 0.5;
    this.halfHeight = this.height * 0.5;
  
  }

}
