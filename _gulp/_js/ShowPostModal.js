
import Modal from './Modal';
import Util from './Util';
import Loading from './Loading';

export default class ShowPostModal extends Modal{

    constructor(){

        super( '.modal.show' );

        this.title = document.querySelector( '.modal.show h2.title' );
        this.titleText = document.querySelector( '.modal.show .title_text' );
        this.titleUserIconAtag = document.querySelector( '.modal.show .title_user_icon a' );
        this.titleUserIcon;
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

        this.authenticity_token = document.getElementById( 'authenticity_token' ).value;
   

    	this.hide();

    }


    //--------------------マウスイベント-------------------
    likeBtnClickHandler(){

        var url = Util.apiHeadUrl + '/likes/create/' + this.questionId + '.json';
        var data = {
            question_id:this.questionId,
            user_id:app.user_id,
            authenticity_token:this.authenticity_token
        };
        $.ajax({
            url:url,
            type:'POST',
            dataType: 'json',
            data:data,
            success:this.postLikeComp.bind( this, data ),
            error:function( result ){
                console.log( result );
            }.bind( this )
        });

        //タップでいいねするポップを非表示にする
        document.getElementsByClassName( 'like_popup' )[0].style.opacity = '0';

    }


    postLikeComp( data, result ){
        
        console.log( result );
        this.likeBtnCount.innerHTML = Number( this.likeBtnCount.innerHTML ) + 1;
        this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'addLike', data:data } } } ) );

    }


    answerBtnClickHandler(){

        this.loading.show();

        var comment = this.comment.value;
        var question_id = this.questionId;
        var url = Util.apiHeadUrl + '/comments.json';
        var data = {
            content:comment,
            question_id:question_id,
            user_id:app.user_id,
            authenticity_token : this.authenticity_token
        };
        $.ajax({
            url:url,
            type:'POST',
            dataType: 'json',
            data:data,
            success:this.postAnswerComp.bind( this, data ),
            error:function( result ){
                console.log( result );
                this.comment.value = '';
                this.loading.hide();
            }.bind( this )
        });

    }


    postAnswerComp( data, result ){
        
        console.log( result );
        this.comment.value = '';
        this.loading.hide();
        this.addComment( data.content, app.user_id );
        this.element.dispatchEvent( new CustomEvent( 'ysdCallback', { detail:{ value:{ type:'addComment', data:data } } } ) );

        var noComment = this.comments.getElementsByClassName( 'no_comment' )[0];
        if( noComment ) this.comments.removeChild( noComment );

    }


    //---------------------
    //質問タイトルと、質問テキストを配置
    setText( data ){

        this.add( data );

        this.questionId = data.id;

    }


    loadQuestion( id ){

        var url = Util.apiHeadUrl + '/questions/' + id;
        $.ajax({
            url:url,
            type:'GET',
            dataType: 'json',
            success:function( result ){
                this.add( result );
                this.loadFlag = false;
            }.bind( this ),
            error:function( result ){
                if( result.id != null ){
                    this.add( result );
                    this.loadFlag = false;
                }
            }.bind( this )
        });

    }


    add( data ){

        if( data.type == 'flickr' ){

            this.element.className = 'modal show flickr';
            this.photoContainer.innerHTML = '<img src="' + data.photo + '">';
            this.titleText.innerHTML = data.title;

        }else if( data.type == 'chiikinogennki' || data.type == 'yahoo' ){
            
            this.element.className = 'modal show';            

            this.titleText.innerHTML = data.title;
            if( data.photo ){
                this.photoContainer.innerHTML = '<img src="' + data.photo + '">';
            }
            this.content.innerHTML = data.content;

        }else{

            this.element.className = 'modal show';

            this.titleText.innerHTML = data.title;
            this.titleUserIcon = this.addUserIcon( data.user_id, this.titleUserIconAtag );
            var url = '/users/' + data.user_id;
            this.titleUserIconAtag.setAttribute( 'href', url );

            if( data.photo ){
                this.photoContainer.innerHTML = '<img src="' + data.photo + '">';
            }

            this.content.innerHTML = data.content;

            if( data.comments.length == 0 ){
                this.comments.innerHTML = '<li class="no_comment"><p>コメントがありません</p></li>';
            }else{
                this.addComments( data.comments );
            }

            this.setLikeCount( data.likes );


            //sns
            var facebook = this.element.getElementsByClassName( 'facebook' )[0];
            var twitter = this.element.getElementsByClassName( 'twitter' )[0];
            var text = encodeURIComponent( data.content );
            var url = encodeURIComponent( 'http://hoge.jp' );
            var href = 'http://twitter.com/share?text=' + text + '&amp;url=' + url;
            twitter.setAttribute( 'href', href );
            var line = this.element.getElementsByClassName( 'line' )[0];
            href = 'https://social-plugins.line.me/lineit/share?url=' + url + '&amp;text=' + text;
            line.setAttribute( 'href', href );

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
        var a = document.createElement( 'a' );
        li.appendChild( a );
        var url = '/users/' + user_id;
        a.setAttribute( 'href', url );
        this.addUserIcon( user_id, a );

        var p = document.createElement( 'p' );
        p.innerHTML = content;
        li.appendChild( p );

    }


    addUserIcon( user_id, parent ){

        var img = new Image();
        var src = '/docs/user_icon/' + user_id + '.jpg';
        img.setAttribute( 'src', src );
        parent.appendChild( img );
        img.onerror = function( _img ){
            _img.setAttribute( 'src', '/docs/user_icon/no_image.jpg' );
        }.bind( this, img );

        return img;

    }


    setLikeCount( likes ){

        if( !likes ) return;

        this.likeBtnCount.innerHTML = likes.length;

    }


    refresh(){

        if( this.titleUserIcon ) this.titleUserIconAtag.removeChild( this.titleUserIcon );
        this.titleText.innerHTML = '';
        this.photoContainer.innerHTML = '';        
        this.content.innerHTML = '';
        this.likeBtnCount.innerHTML = '';
        this.comment.value = '';
        this.comments.innerHTML = '';

    }

}
