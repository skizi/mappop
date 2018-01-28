import MainMenu from './MainMenu';
import Map from './Map';


class Main{

  constructor(){

    $( window ).load(function(){
      new MainMenu();
    });


    var url = 'http://localhost:3000/questions.json';
    $.ajax({
        url:url,
        type:'POST',
        // xhrFields: {
        //   withCredentials: true
        // },
        data:{
            title:'title0',
            content:'text',
            lat:0,
            lng:1,
            user_id:0
        },
        success:function( result ){
          console.log( result );
        },
        error:function( result ){
          console.log( result );
        }
    })

  }


  initMap(){
    new Map();
  }

}

var main = new Main();
app.initMap = main.initMap;