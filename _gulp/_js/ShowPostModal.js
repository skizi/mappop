
import Modal from './Modal';
import Util from './Util';

export default class ShowPostModal extends Modal{

    constructor(){

        super( '.modal.show' );

        this.title = document.querySelector( '.modal.show .title' );
        this.content = document.querySelector( '.modal.show .content' );
        this.comment = document.querySelector( '.modal.show .comment' );
        this.comments = document.querySelector( '.modal.show .comments' );
        this.answerBtn = document.querySelector( '.modal.show .answer_btn' );
        this.answerBtn.addEventListener( 'click', this.answerBtnClickHandler.bind( this ) );

    	this.hide();

    }


    //--------------------マウスイベント-------------------
    answerBtnClickHandler(){

        var comment = this.comment.value;
        var question_id = this.questionId;
        var url = Util.apiHeadUrl + '/comments.json';
        $.ajax({
            url:url,
            type:'POST',
            data:{ content:comment, question_id:question_id, user_id:0 },
            success:function( result ){
              console.log( result );
            },
            error:function( result ){
              console.log( result );
            }.bind( this )
        });

        var noComment = this.comments.getElementsByClassName( 'no_comment' )[0];
        if( noComment ) this.comments.removeChild( noComment );

        this.addComment( comment, 0 );
        this.comment.value = '';

    }


    //---------------------

    //質問タイトルと、質問テキストを配置
    setText( title, content, questionId, comments ){

        this.title.innerHTML = title;
        this.content.innerHTML = content;
        this.questionId = questionId;

        if( comments.length == 0 ){
            this.comments.innerHTML = '<li><p class="no_comment">コメントがありません</p></li>';
        }else{
            this.addComments( comments );
        }

    }


    //コメント一覧を配置
    addComments( comments ){

        this.comments.innerHTML = '';
        var length = comments.length;
        for( var i = 0; i < length; i++ ){
            var obj = comments[i];
            this.addComment( obj.content, obj.user_id );
        }

    }


    addComment( content, user_id ){

        var li = document.createElement( 'li' );
        this.comments.appendChild( li );

        var img = new Image();
        var src = '/docs/user_icon/' + user_id + '.jpg';
        img.setAttribute( 'src', src );
        li.appendChild( img );
        img.onerror = function( _img ){
            _img.setAttribute( 'src', '/docs/user_icon/no_image.jpg' );
        }.bind( this, img );

        var p = document.createElement( 'p' );
        p.innerHTML = content;
        li.appendChild( p );

    }


    refresh(){

        this.comment.value = '';
        this.comments.innerHTML = '';

    }

}
