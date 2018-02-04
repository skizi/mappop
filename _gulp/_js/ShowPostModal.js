
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


  setText( title, content, questionId, comments ){

    this.title.innerHTML = title;
    this.content.innerHTML = content;
    this.questionId = questionId;
    this.addComments( comments );
    // var url = Util.apiHeadUrl + '/comments/get_comments/' + questionId + '.json';
    // $.ajax({
    //     url:url,
    //     type:'GET',
    //     data:{},
    //     success:function( results ){
    //       console.log( results );
    //       this.addComments( results );
    //     }.bind( this ),
    //     error:function( result ){
    //       console.log( result );
    //     }.bind( this )
    // });

  }


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

  }


  addComments( comments ){

    var html = '';
    var length = comments.length;
    for( var i = 0; i < length; i++ ){
      var obj = comments[i];
      html += '<li>' + obj.content + '</li>';
    }
    this.comments.innerHTML = html;

  }


  refresh(){

    this.comment.value = '';
    this.comments.innerHTML = '';

  }

}
