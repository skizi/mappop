
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
		{
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
			maxZoom: 18
		}
	).addTo( this.map );

    this.popups = [];

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
		var content = L.DomUtil.create( 'div', 'popup' );
		content.innerHTML = obj.title;
		L.DomEvent.on( content, 'click', this.popupClickHandler.bind( this, i ) );

		var popup = L.popup()
		    .setLatLng([ Number( obj.lat ), Number( obj.lng ) ])
		    .setContent( content )
		    .openOn( this.map );
		this.popups.push( popup );

		//google.maps.event.addDomListener( content,'click', this.popupClickHandler.bind( this, i ));
  	}
console.log(L.DomUtil.create);
  }


  popupClickHandler( index ){

	this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'popupClick', data:this.results[index] } } } ) );

  }


  btnClickHandler(){

	var bounds = this.map.getCenter();
	this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'newPost', lat:bounds.lat(), lng:bounds.lng() } } } ) );

  }

}
