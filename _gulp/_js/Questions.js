import Map from './Map';
import NewPostModal from './NewPostModal';
import ShowPostModal from './ShowPostModal';


document.addEventListener( "DOMContentLoaded", function(){  

  new Questions();

} );



class Questions{

  constructor(){

    //document.addEventListener( "DOMContentLoaded", function(){
      this.newPostModal = new NewPostModal();
      this.showPostModal = new ShowPostModal();
    //}.bind( this ) );

  //   this.initMap();

  // }


  // initMap(){

    this.map = new Map();
    this.map.initMap();
    this.map.element.addEventListener( 'ysdCallback', this.mapCallBackHandler.bind( this ) );
    
    // var zoom = window.innerWidth / 750;
    // document.querySelector( 'header' ).style.zoom = zoom;
    //document.querySelector( '.main_content' ).style.zoom = zoom;
    // document.querySelector( 'footer' ).style.zoom = zoom;
    // document.querySelector( '.main_menu' ).style.zoom = zoom;

  }


  mapCallBackHandler( e ){
    
    var obj = e.detail.value;
    switch( obj.type ){

      case 'popupClick':
        this.showPostModal.refresh();
        this.showPostModal.setText( obj.data );
        this.showPostModal.show();
        break;

      case 'newPost':
        this.newPostModal.lat = obj.lat;
        this.newPostModal.lng = obj.lng;
        this.newPostModal.show();
        break;

    }
  }

}

//var questions = new Questions();
//app.initMap = questions.initMap.bind( questions );