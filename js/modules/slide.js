import configuration from './configuration.js';

export default class Slide {

    constructor( wrapper, list ) {
        
        this.wrapper = document.querySelector( configuration.getSelector( 'component', wrapper ) );
        this.list    = this.wrapper.querySelector( configuration.getSelector( 'component', list ) );
        console.log( this.wrapper, this.list )

        this.data = {
            start     : 0,
            current   : 0,
            end : 0
        }
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

        this.data.start = event.clientX;
        this.wrapper.addEventListener( 'mousemove', this.move );
    }

    move( event ) {

        this.place( 
            this.update( event.clientX ) );
    }

    place( position ) {
        
        this.data.current = position;
        this.list.style.transform = `translate3d(${position}px, 0, 0)`;
    }

    update( position ) {
        this.data.current = ( this.data.start - position ) * 1.6;
        return ( this.data.end - this.data.current );
    }

    stop( event ) {

        
        this.wrapper.removeEventListener( 'mousemove', this.move );
        this.data.end = this.data.current;

        console.log( this.data );
    }
}