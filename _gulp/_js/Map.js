
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

    this.popups = [];


    var min = {
      lat:35.67,
      lng:139.76
    };
    var max = {
      lat:35.679,
      lng:139.763
    }
    this.searchLatLng( min, max );

  }


  initMap() {

    var url = Util.apiHeadUrl + '/questions/all.json';
    $.ajax({
        url:url,
        type:'GET',
        data:{},
        success: this.jsonLoadComp.bind( this ),
        error:function( result ){
          console.log( result );
        }.bind( this )
    });

  }


  jsonLoadComp( results ){

  	this.results = results;
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
      this.addPopup( obj.title, obj.lat, obj.lng, i );

		  //google.maps.event.addDomListener( content,'click', this.popupClickHandler.bind( this, i ));
  	}

  }


  popupClickHandler( index ){

	 this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'popupClick', data:this.results[index] } } } ) );

  }


  btnClickHandler(){

    var bounds = this.map.getCenter();

//console.log( this.map.getZoom() );
console.log( this.getSplitAreaId( bounds.lat, bounds.lng ) );

  	this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'newPost', lat:bounds.lat, lng:bounds.lng } } } ) );

  }


  addPopup( title, lat, lng, i ){

    if( i == null ) i = this.popups.length;

    var content = L.DomUtil.create( 'div', 'popup' );
    content.innerHTML = title;
    L.DomEvent.on( content, 'click', this.popupClickHandler.bind( this, i ) );

    var popup = L.popup({ autoPan:false, keepInView:true, autoClose:false, closeOnEscapeKey:false })
        .setLatLng([ Number( lat ), Number( lng ) ])
        .setContent( content )
        .openOn( this.map );
    this.popups.push( popup );

  }


  pushData( data ){

    this.results.push( data );

  }


  //地図全体を升目で区切り
  //latとlngとzoomレベルからから升目のxとyのindex番号を取得する
  getSplitAreaId( lat, lng ){

    //zoom 0～18
    var z = this.map.getZoom();
    var c = this.map.getCenter();
console.log(z);
console.log(c);

//console.log( "zoom:" + z );


//↓モニターに写っている領域の全体からみたパーセンテージ
//var perX = ( モニターのmaxLat - モニターのminLat ) / 180
//
//↓地図を何文割するかの数値
//var lengthX = 180 / ( モニターのmaxLat - モニターのminLat )
//var lengthY = 360 / ( モニターのmaxLng - モニターのminLng )

//ただ、モニターのサイズはデバイスによって違うので、
//ここでのモニターのサイズは固定で定義するべき 1000 * 1000　ぐらい・・・？

    var p = this.map.getPixelBounds();
    p.min.x += this.halfWidth - 500;
    p.min.y += this.halfHeight - 500;
    p.max.x = p.max.x - this.halfWidth + 500;
    p.max.y = p.max.y - this.halfHeight + 500;
    var minLatLng = this.map.unproject( p.min );
    var maxLatLng = this.map.unproject( p.max );

    var perX = ( c.lng + 180 ) / 360;
    var perY = ( c.lat + 90 ) / 180;
    var lengthX = 360 / ( maxLatLng.lng - minLatLng.lng );
    var lengthY = 180 / ( minLatLng.lat - maxLatLng.lat );

//各倍率のlengthX, lengthYをクライアントの配列に全て保持し、
//フキダシのlat lngのみサーバーに保存

//現在のマップの中心地が入る升目を調べ
//その 升目のminとmaxの間に含まれるフキダシを全て表示


this.searchLatLng( minLatLng, maxLatLng );//debug

this.addPopup( 'topLeft', minLatLng.lat, minLatLng.lng, 9999 );
this.addPopup( 'bottomRight', maxLatLng.lat, maxLatLng.lng, 9999 );

    var x = Math.floor(lengthX * perX );
    if( x == lengthX ) x = lengthX - 1;

    var y = Math.floor( lengthY * perY );
    if( y == lengthY ) y = lengthY - 1;

    if( c.lat < -90 ) y = 0;
    if( c.lat > 90 ) y = lengthY - 1;
    if( c.lng < -180 ) x = 0;
    if( c.lng > 180 ) x = lengthX - 1;


    return { x:x, y:y };

  }


  searchLatLng( min, max ){

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
        success:function( result ){
          console.log( result );
        },
        error:function( result ){
          console.log( result );
        }.bind( this )
    });

  }


  resize(){
    
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;
    this.halfWidth = this.width * 0.5;
    this.halfHeight = this.height * 0.5;
  
  }

}
