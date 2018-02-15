
import Util from './Util';


export default class Map{

  constructor(){

  	this.element = document.querySelector( '.map_container .map' );
  	this.btn = document.querySelector( '.map_container .btn0' );
  	this.btn.addEventListener( 'click', this.btnClickHandler.bind( this ) );

    this.map = new google.maps.Map( this.element, {
      center: {lat:35.67848924554223, lng:139.76272863769532 },
      zoom: 12,
      fullscreenControl:false,
      mapTypeControl:false,
      streetViewControl:false,
      zoomControl:false
    });

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
  		var content = document.createElement("div");
  		content.className = 'popup';
  		content.innerHTML = obj.title;
		var popup = new google.maps.InfoWindow({
			content: content,
			position: { lat:Number( obj.lat ), lng:Number( obj.lng ) },
			map: this.map,
			disableAutoPan: false
		});
		this.popups.push( popup );

		google.maps.event.addDomListener( content,'click', this.popupClickHandler.bind( this, i ));
  	}

  }


  popupClickHandler( index ){

	this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'popupClick', data:this.results[index] } } } ) );

  }


  btnClickHandler(){

	var bounds = this.map.getCenter();
	this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'newPost', lat:bounds.lat(), lng:bounds.lng() } } } ) );

  }

}
