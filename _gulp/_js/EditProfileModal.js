
import Modal from './Modal';
import Util from './Util';

export default class EditProfileModal extends Modal{

    constructor(){

        super( '.modal.edit_profile' );

        // this.name = document.querySelector( '.modal.edit_profile .name' );
        // this.location = document.querySelector( '.modal.edit_profile .location' );
        // this.about = document.querySelector( '.modal.edit_profile .about' );
        // this.submitBtn = document.querySelector( '.modal.edit_profile .submit_btn' );
        // this.submitBtn.addEventListener( 'click', this.submitBtnClickHandler.bind( this ) );

        this.changePhoto = this.element.getElementsByClassName( 'change_photo' )[0];
        this.changeProfile = this.element.getElementsByClassName( 'change_profile' )[0];

        this.changeBtn0 = this.changePhoto.getElementsByClassName( 'change_type_btn' )[0];
        this.changeBtn0.addEventListener( 'click', this.changeBtn0ClickHandler.bind( this ) );
        this.changeBtn1 = this.changeProfile.getElementsByClassName( 'change_type_btn' )[0];
        this.changeBtn1.addEventListener( 'click', this.changeBtn1ClickHandler.bind( this ) );

    	this.hide();

    }


    set type( _type ){

        this._type = _type;
        if( _type == 'profile' ){
            this.changeBtn0ClickHandler();
        }else{
            this.changeBtn1ClickHandler();
        }

    }


    changeBtn0ClickHandler(){

        this.changePhoto.style.display = 'none';
        this.changeProfile.style.display = 'block';

    }


    changeBtn1ClickHandler(){

        this.changePhoto.style.display = 'block';
        this.changeProfile.style.display = 'none';

    }


    //--------------------マウスイベント-------------------
    // submitBtnClickHandler(){

    //     var name = this.name.value;
    //     var location = this.location.value;
    //     var about = this.about.value;
    //     var url = Util.apiHeadUrl + '/comments.json';
    //     $.ajax({
    //         url:url,
    //         type:'POST',
    //         data:{ content:comment, question_id:question_id, user_id:0 },
    //         success:function( result ){
    //           console.log( result );
    //         },
    //         error:function( result ){
    //           console.log( result );
    //         }.bind( this )
    //     });
    // }
}
