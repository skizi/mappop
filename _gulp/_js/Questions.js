import Map from './Map';
import NewPostModal from './NewPostModal';
import ShowPostModal from './ShowPostModal';


class Questions{

  constructor(){

    document.addEventListener( "DOMContentLoaded", function(){
      this.newPostModal = new NewPostModal();
      this.showPostModal = new ShowPostModal();
    }.bind( this ) );

  }


  initMap(){

    this.map = new Map();
    this.map.initMap();
    this.map.element.addEventListener( 'ysdCallback', this.mapCallBackHandler.bind( this ) );
  
  }


  mapCallBackHandler( e ){
    
    var obj = e.detail.value;
    switch( obj.type ){

      case 'popupClick':
        this.showPostModal.refresh();
        this.showPostModal.setText( obj.data.title, obj.data.content, obj.data.id, obj.data.comments );
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

var questions = new Questions();
app.initMap = questions.initMap.bind( questions );