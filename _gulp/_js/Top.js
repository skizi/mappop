

document.addEventListener( "DOMContentLoaded", function(){  

  new Top();

} );




class Top{

  constructor(){

    var latlng = [ 35.67848924554223, 139.76272863769532];
    var opsion = {
      zoomControl:false,
      dragging:false,
      doubleClickZoom:false,
      boxZoom:false,
      scrollWheelZoom:false
    };
    this.map = L.map( 'leafletMap', opsion ).setView( latlng, 12 );
  	L.tileLayer(
  		'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

  		//なぜかRetina対応タイルが存在しない
  		//'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png',
  		{
  			attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        minZoom: 3,
  			maxZoom: 18
  			//detectRetina:true
  		}
  	).addTo( this.map );

  }

}