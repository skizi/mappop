
export default class Map{

  constructor(){
  	this.element = document.getElementById('map');
    var map = new google.maps.Map( this.element, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }

  initMap() {
  }
}
