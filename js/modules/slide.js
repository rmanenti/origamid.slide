import configuration from './configuration.js';

export default class Slide {

    constructor( wrapper, list ) {
        
        this.wrapper = document.querySelector( configuration.getSelector( 'component', wrapper ) );
        this.list    = this.wrapper.querySelector( configuration.getSelector( 'component', list ) );
        
        this.current = null;

        this.events = {
            start : [ 'mousedown', 'touchstart' ],
            move  : [ 'mousemove', 'touchmove' ],
            end   : [ 'mouseup', 'touchend' ]
        };

        this.data = {
            position : {
                start     : 0,
                current   : 0,
                end       : 0
            },
            indexes : {
                previous : 0,
                current  : 0,
                next     : 1
            }
        }
    }

    initialize() {

        this.bindings();
    
        this.items = [ ...this.list.children ].map( ( item ) => {

            const position = -( item.offsetLeft - ( ( this.wrapper.offsetWidth - item.offsetWidth ) / 2 ) );

            return {
                item,
                position
            }
        } );

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

        this.data.position.start = event.clientX;

        if ( event.type === 'mousedown' ) {
            event.preventDefault();            
        }
        else {
            this.data.position.start = event.changedTouches[ 0 ].clientX;
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

    slide( index ) {
        
        this.data.indexes.previous = ( index ? ( index - 1 ) : index );
        this.data.indexes.current  = index;
        this.data.indexes.next     = ( index === ( this.items.length - 1 ) ? index : ( index + 1 ) );

        this.current = this.items[ index ];
        this.data.position.end = this.current.position;

        this.place( this.current.position );
    }

    place( position ) {

        this.data.position.current = position;
        this.list.style.transform = `translate3d(${position}px, 0, 0)`;
    }

    update( position ) {
        this.data.position.current = ( this.data.position.start - position ) * 1.6;
        return ( this.data.position.end - this.data.position.current );
    }

    stop( event ) {

        this.events.move.forEach( ( event ) => {
            this.wrapper.removeEventListener( event, this.move );
        } );
        
        this.data.position.end = this.data.position.current;
    }
}