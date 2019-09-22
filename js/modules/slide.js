import configuration from './configuration.js';

export default class Slide {

    constructor( wrapper, list ) {
        
        this.wrapper = document.querySelector( configuration.getSelector( 'component', wrapper ) );
        this.list    = this.wrapper.querySelector( configuration.getSelector( 'component', list ) );
        
        this.events = {
            start : [ 'mousedown', 'touchstart' ],
            move  : [ 'mousemove', 'touchmove' ],
            end   : [ 'mouseup', 'touchend' ]
        };

        this.data = {
            start     : 0,
            current   : 0,
            end : 0
        }
    }

    initialize() {

        this.bindings();

        if ( this.wrapper !== undefined ) {

            this.events.start.forEach( ( event ) => {
                this.wrapper.addEventListener( event, this.start );
            } );

            this.events.end.forEach( ( event ) => {
                this.wrapper.addEventListener( event, this.stop );
            } );
        }
    }

    bindings() {
        
        this.start = this.start.bind( this );
        this.move = this.move.bind( this );
        this.stop = this.stop.bind( this );
    }

    start( event ) {

        this.data.start = event.clientX;

        if ( event.type === 'mousedown' ) {
            event.preventDefault();            
        }
        else {
            this.data.start = event.changedTouches[ 0 ].clientX;
        }

        this.events.move.forEach( ( event ) => {
            this.wrapper.addEventListener( event, this.move );
        } );

        
    }

    move( event ) {

        let clientX = event.clientX;

        if ( event.type === 'touchmove' ) {
            clientX = event.changedTouches[ 0 ].clientX;
        }

        this.place( 
            this.update( clientX ) );
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

        this.events.move.forEach( ( event ) => {
            this.wrapper.removeEventListener( event, this.move );
        } );
        
        this.data.end = this.data.current;
    }
}