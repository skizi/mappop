
import Util from './Util';


export default class Map{

  constructor(){

    this.zoom = 13;
    this.debugFlag = false;

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
    this.map = L.map( 'leafletMap' ).setView( latlng, this.zoom );
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
    this.allPopupLength = 0;

    this.rankerPopups = {};
    this.rankerPopups[ 'country' ] = [];
    this.rankerPopups[ 'state' ] = [];
    this.rankerPopups[ 'city' ] = [];

    this.oldIndexs = [];
    this.map.on( 'moveend', this.mapMoved.bind( this ) );
    this.map.on( 'zoomstart', this.mapZoomStart.bind( this ) );
    this.map.on( 'zoomend', this.mapZoomEnd.bind( this ) );
    // this.map.on( 'load', function(){
    // }.bind( this ) );
    //L.marker([ _maxLatLng.lat, _maxLatLng.lng ]).addTo(this.map);


    L.Icon.Default.imagePath = './assets/map/leaflet/';

    window.onload = this.checkNewQuestions.bind( this );


    //ユーザーの現在地を取得
    this.checkGps();
    this.gpsIntervalId = setInterval( this.checkGps.bind( this ), 5000 );

  }


  mapMoved(){

    this.checkNewQuestions();

  }


  mapZoomStart(){

    this.allDelete();

  }


  allDelete(){

    var length = this.oldIndexs.length;
    for( var i = length-1; i > -1; i-- ) this.removeData( i );
    this.oldIndexs = [];

  }


  mapZoomEnd(){

    this.zoom = this.map.getZoom();
    console.log( "zoom:" + this.zoom );
    this.latLngDist = this.getLatLngDist();

  }


  checkNewQuestions(){

    var c = this.map.getCenter();
    var now = this.getSplitAreaId( c.lat, c.lng );
    var hasFlag = this.hasOldIndex( now );
    if( !hasFlag ){

      //通常popup取得
      this.getQuestions( now, this.jsonLoadComp.bind( this, now.x, now.y ) );

      var data = { x:now.x, y:now.y };
      if( this.debugFlag ){
        var c = "#" + Math.floor(Math.random() * 16777215).toString(16);
        var bounds = [[now.minLatLng.lat, now.minLatLng.lng], [now.maxLatLng.lat, now.maxLatLng.lng]];
        data.debugRect = L.rectangle(bounds, {color: c, weight: 1}).addTo(this.map);
      }

      //タイルindexキャッシュ
      this.oldIndexs.push( data );
    }
    
    //２マスはなれたポップアップたちを削除
    var length = this.oldIndexs.length;
    for( var i = length-1; i > -1; i-- ){
      var old = this.oldIndexs[i];
      var distX = Math.abs( old.x - now.x );
      var distY = Math.abs( old.y - now.y );
      if( distX + distY > 2 ){
        this.removeData( i );
      }
    }

  }


  removeData( i ){

    var data = this.oldIndexs[i];
    this.removePopups( data.x, data.y );
    if( this.debugFlag ) data.debugRect.remove();
    this.oldIndexs.splice( i, 1 );

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


    if( !this.latLngDist ) this.latLngDist = this.getLatLngDist(); 
    var w = this.latLngDist.x;
    var h = this.latLngDist.y;
    
    var perX = ( lng + 180 ) / 360;
    var perY = ( lat + 90 ) / 180;
    var lengthX = 360 / w;
    var lengthY = 180 / h;

    //各倍率のlengthX, lengthYをクライアントの配列に全て保持し、
    //フキダシのlat lngのみサーバーに保存

    //現在のマップの中心地が入る升目を調べ
    //その 升目のminとmaxの間に含まれるフキダシを全て表示


    var x = Math.floor(lengthX * perX );
    if( x == lengthX ) x = lengthX - 1;

    var y = Math.floor( lengthY * perY );
    if( y == lengthY ) y = lengthY - 1;

    if( lat < -90 ) y = 0;
    if( lat > 90 ) y = lengthY - 1;
    if( lng < -180 ) x = 0;
    if( lng > 180 ) x = lengthX - 1;


var _x = w * x - 180;
var _y = h * y - 90;
var _minLatLng = L.latLng( _y+h, _x );
var _maxLatLng = L.latLng( _y, _x+w );
// console.log( "minLatLng----" );
// console.log( _minLatLng.lat, _minLatLng.lng );

// console.log( "origin----" );
// console.log( lat, lng );

// console.log( "maxLatLng----" );
// console.log( _maxLatLng.lat, _maxLatLng.lng );


    return { x:x, y:y, minLatLng:_minLatLng, maxLatLng:_maxLatLng };

  }


  getQuestions( hitAreaData, callback ){

    var index = { x:hitAreaData.x, y:hitAreaData.y };

    //もし古いデータが残っていたら、ajaxキャンセル＆キャッシュされたデータを削除
    if( this.ajaxData ){
      var _i = -1;
      var length = this.oldIndexs.length;
      for( var i = 0; i < length; i++ ){
        if( this.ajaxData.index.x == this.oldIndexs[i].x &&
            this.ajaxData.index.y == this.oldIndexs[i].y ){
          _i = i;
        }
      }
      if( _i != -1 ) this.removeData( _i );
      

      //abortが走るとajaxErrorが発行されてしまい、
      //ajaxDataがnullになってしまうので、後でabortする
      this.ajaxData.$.abort();
    }

    //ajaxリクエスト
    var data = {
      min_lat:hitAreaData.minLatLng.lat,
      min_lng:hitAreaData.minLatLng.lng,
      max_lat:hitAreaData.maxLatLng.lat,
      max_lng:hitAreaData.maxLatLng.lng,
      limit:20
    };
    var url = Util.apiHeadUrl + '/questions/search_lat_lng.json';    
    this.ajaxData = { index:index };
    this.ajaxData.$ = $.ajax({
        url:url,
        type:'GET',
        data:data,
        success:function( _callback, result ){
          this.ajaxData = null;
          _callback( result );
        }.bind( this, callback ),
        error:function( _callback, result ){
          this.ajaxData = null;
          //_callback( result );
        }.bind( this, callback )
    });

  }

  /*
  getRankingData( limit, callback ){

    var c = this.map.getCenter();
    var z = this.map.getZoom();
    var url = 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + c.lat + '&lon=' + c.lng + '&zoom=' + z;
    if( this.nowRankingAjax ) this.nowRankingAjax.abort();
    this.nowRankingAjax = $.ajax({
        url:url,
        type:'GET',
        success:function( _limit, _callback, result ){
          this.getRankingDataStep2( _limit, _callback, result );
        }.bind( this, limit, callback ),
        error:function( result ){
          console.log( result );
        }.bind( this )
    });

  }


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

  jsonLoadComp( x, y, results ){

    var key = x + ',' + y;
    if( !this.popups[ key ] ) this.popups[ key ] = [];

  	var length = results.length;
  	for( var i = 0; i < length; i++ ){
  		var data = results[i];

  		//google map
  		// var content = document.createElement("div");
  		// content.className = 'popup';
  		// content.innerHTML = data.title;
  		// var popup = new google.maps.InfoWindow({
  		// 	content: content,
  		// 	position: { lat:Number( data.lat ), lng:Number( data.lng ) },
  		// 	map: this.map,
  		// 	disableAutoPan: false
  		// });
      //google.maps.event.addDomListener( content,'click', this.popupClickHandler.bind( this, i ));


  		//leaflet
      var popup = this.createPopup( data, i );
      popup.data = data;
      this.popups[ key ].push( popup );

  	}

    this.allPopupLength += length;

  }


  //ポップアップを作成
  createPopup( data, index ){

    var content = L.DomUtil.create( 'div', 'popup' );
    //content.innerHTML = data.title;

    var popup = L.popup({ autoPan:false, keepInView:true, autoClose:false, closeOnEscapeKey:false, closeOnClick:false })
        .setLatLng([ Number( data.lat ), Number( data.lng ) ])
        .setContent( content )
        .openOn( this.map );

    this.addUserIcon( data.user_id, content );
    var span = document.createElement( 'span' );
    span.innerHTML = data.title;
    content.appendChild( span );

// var draggable = new L.Draggable(popup._container, popup._wrapper);
// draggable.enable();
    
    var rank = this.getRank( data );

    var element = popup.getElement();
    element.setAttribute( 'class', element.className + rank );
    L.DomEvent.on( element, 'click', this.popupClickHandler.bind( this, data ) );

    return popup;

  }


  getRank( data ){

    var rank = 'stateRank1';

    if( this.zoom < 6 ){
      rank = ' ranker stateRank' + ( data.state_rank + 1 );
      if( data.state_rank == -1 ) rank = '';
    }else if( this.zoom < 14 ){
      rank = ' ranker countryRank' + ( data.country_rank + 1 );
      if( data.country_rank == -1 ) rank = '';
    }else{
      rank = ' ranker cityRank' + ( data.city_rank + 1 );
      if( data.city_rank == -1 ) rank = '';
    }
    if( data.likes.length == 0 ) rank = '';
    
    return rank;
  
  }


  addUserIcon( user_id, parent ){

      var img = new Image();
      var src = '/docs/user_icon/' + user_id + '.jpg';
      img.setAttribute( 'src', src );
      parent.appendChild( img );
      img.onerror = function( _img ){
          _img.setAttribute( 'src', '/docs/user_icon/no_image.jpg' );
      }.bind( this, img );

      return img;

  }


  removePopups( x, y, allDeleteFlag ){

    if( allDeleteFlag ){
      for( var key in this.popups ){
        this.removeBoundsPopup( key );
      }
    }else{
      var key = x + ',' + y;
      if( !this.popups[ key ] ) return;
      this.removeBoundsPopup( key );
    }

  }


  removeBoundsPopup( key ){

    var length = this.popups[ key ].length;
    for( var i = 0; i < length; i++ ){
      //var content = this.popups[ key ][i].getContent();
      var element = this.popups[ key ][i].getElement();
      L.DomEvent.off( element, 'click', this.popupClickHandler.bind( this ) );
      this.popups[ key ][i].remove();
      this.allPopupLength--;
    }

    if( this.allPopupLength < 0 ) this.allPopupLength = 0;

    delete this.popups[ key ];

  }


  popupClickHandler( data ){

	 this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'popupClick', data:data } } } ) );

  }


  btnClickHandler(){

    var bounds = this.map.getCenter();
    var zoom = this.map.getZoom();
  	this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'newPost', lat:bounds.lat, lng:bounds.lng, zoom:zoom } } } ) );

  }


  //画面サイズに合ったlat lngの幅・高さを取得
  getLatLngDist(){

      var p = this.map.getPixelBounds();
      var minLatLng = this.map.unproject( p.min );
      var maxLatLng = this.map.unproject( p.max );

      var x = ( maxLatLng.lng - minLatLng.lng );
      var y = ( minLatLng.lat - maxLatLng.lat );
      var latLngDist = { x:x, y:y };

      return latLngDist;

  }


  setComment( data ){

    var popup = this.getTargetPopup( data.question_id );
    popup.data.comments.push( data );
  
  }


  setLike( data ){

    var popup = this.getTargetPopup( data.question_id );
    popup.data.likes.push( data );

  }


  getTargetPopup( question_id ){

    var popup;

    for( var key in this.popups ){
      var popups = this.popups[key];
      var length = popups.length;
      for( var i = 0; i < length; i++ ){
        if( question_id == popups[i].data.id ){
          popup = popups[i];
        }
      }
    }

    return popup;

  }


  checkGps(){
    
    navigator.geolocation.getCurrentPosition(
      function( pos ){

        var latLng = L.latLng( pos.coords.latitude, pos.coords.longitude );
        console.log( latLng );
        
        if( this.userMaker ){
        
          this.userMaker.setLatLng( latLng );
        
        }else{//初回アクセス

          this.map.setZoomAround( latLng, 13 );
          this.userMaker = L.marker([ latLng.lat, latLng.lng ]).addTo(this.map);
        }
      }.bind( this ),
      function( error ){

        console.log( error );
        if( error.code == 1 ){
          alert( "位置情報の利用が許可されていません" );
        }

        clearInterval( this.gpsIntervalId );

      }.bind( this ),
      {
        enableHighAccuracy:true
      }
    );

  }


  resize(){
    
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;
    this.halfWidth = this.width * 0.5;
    this.halfHeight = this.height * 0.5;

    this.latLngDist = this.getLatLngDist();

    this.allDelete();
  
  }

}
