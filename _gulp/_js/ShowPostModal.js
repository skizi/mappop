
import Modal from './Modal';
import Util from './Util';
import Loading from './Loading';

export default class ShowPostModal extends Modal{

    constructor(){

        super( '.modal.show' );

        this.title = document.querySelector( '.modal.show .title .title_text' );
        this.photoContainer = document.querySelector( '.modal.show .photo' );
        this.likeBtn = document.querySelector( '.modal.show .like_btn' );
        this.likeBtn.addEventListener( 'click', this.likeBtnClickHandler.bind( this ) );
        this.likeBtnCount = document.querySelector( '.modal.show .like_btn .count' );
        this.content = document.querySelector( '.modal.show .content' );
        this.comment = document.querySelector( '.modal.show .comment' );
        this.comments = document.querySelector( '.modal.show .comments' );
        this.answerBtn = document.querySelector( '.modal.show .answer_btn' );
        this.answerBtn.addEventListener( 'click', this.answerBtnClickHandler.bind( this ) );

        this.loading = new Loading();

    	this.hide();

    }


    show(){

        this.element.style.display = 'block';
        setTimeout(function(){
            this.inner.style.transform = 'translateX(0%)';
        }.bind( this ), 100);

    }


    hide(){

        this.inner.style.transform = 'translateX(-100%)';
        setTimeout(function(){
            this.element.style.display = 'none';
        }.bind( this ), 300);

    }


    //--------------------マウスイベント-------------------
    likeBtnClickHandler(){

        var url = Util.apiHeadUrl + '/likes.json';
        var data = {
            question_id:this.questionId,
            user_id:app.user_id
        };
        $.ajax({
            url:url,
            type:'POST',
            data:data,
            success:function( result ){
                console.log( result );
                this.likeBtnCount.innerHTML = Number( this.likeBtnCount.innerHTML ) + 1;
            }.bind( this ),
            error:function( result ){
                console.log( result );
                if( result.question_id ){
                    this.likeBtnCount.innerHTML = Number( this.likeBtnCount.innerHTML ) + 1;
                }
            }.bind( this )
        });

    }


    answerBtnClickHandler(){

        this.loading.show();

        var comment = this.comment.value;
        var question_id = this.questionId;
        var url = Util.apiHeadUrl + '/comments.json';
        var data = {
            content:comment,
            question_id:question_id,
            user_id:app.user_id
        };
        $.ajax({
            url:url,
            type:'POST',
            data:data,
            success:function( result ){
                console.log( result );
                this.comment.value = '';
                this.loading.hide();
            }.bind( this ),
            error:function( result ){
                console.log( result );
                this.comment.value = '';
                this.loading.hide();
            }.bind( this )
        });

        var noComment = this.comments.getElementsByClassName( 'no_comment' )[0];
        if( noComment ) this.comments.removeChild( noComment );

        this.addComment( comment, app.user_id );

    }


    //---------------------

    //質問タイトルと、質問テキストを配置
    setText( data ){

        this.title.innerHTML = data.title;
        if( data.photo ) this.photoContainer.innerHTML = '<img src="' + data.photo + '">';
        this.content.innerHTML = data.content;
        this.questionId = data.id;

        if( data.comments.length == 0 ){
            this.comments.innerHTML = '<li><p class="no_comment">コメントがありません</p></li>';
        }else{
            this.addComments( data.comments );
        }

        this.setLikeCount( data.likes );

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


    setLikeCount( likes ){

        if( !likes ) return;

        this.likeBtnCount.innerHTML = likes.length;

    }


    refresh(){

        this.comment.value = '';
        this.comments.innerHTML = '';

    }

}
