
import Util from './Util';

export default class Loading{

    constructor(){

        this.element = document.getElementsByClassName( 'loading_cover' )[0];

    }


    show(){

    	this.element.style.display = 'block';
    	this.element.style.opacity = 0;
    	setTimeout(function(){
    		this.element.style.opacity = 1;
    	}.bind( this ), 100);

    }


    hide(){

    	this.element.style.opacity = 0;
    	setTimeout(function(){
	    	this.element.style.display = 'none';
    	}.bind( this ), 300);

    }

}