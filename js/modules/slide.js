import configuration from './configuration.js';

export default class Slide {

    constructor( wrapper, list ) {
        
        this.wrapper = document.querySelector( configuration.getSelector( 'component', wrapper ) );
        this.list    = this.wrapper.querySelector( configuration.getSelector( 'component', list ) );
    }

    initialize() {

        this.bindings();

        if ( this.wrapper !== undefined ) {
            this.wrapper.addEventListener( 'mousedown', this.start );
            this.wrapper.addEventListener( 'mouseup', this.stop );
        }
    }

    bindings() {
        
        this.start = this.start.bind( this );
        this.move = this.move.bind( this );
        this.stop = this.stop.bind( this );
    }

    start( event ) {

        event.preventDefault();
        this.wrapper.addEventListener( 'mousemove', this.move );
    }

    move( event ) {

    }

    stop( event ) {
        this.wrapper.removeEventListener( 'mousemove', this.move );
    }
}