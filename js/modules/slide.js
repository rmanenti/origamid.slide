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

            this.center();
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

        this.animate( false );
    }

    move( event ) {

        let clientX = event.clientX;

        if ( event.type === 'touchmove' ) {
            clientX = event.changedTouches[ 0 ].clientX;
        }

        const position = this.update( clientX );

        this.place( position );
    }

    slide( index ) {
        
        this.data.indexes.previous = ( index ? ( index - 1 ) : undefined );
        this.data.indexes.current  = index;
        this.data.indexes.next     = ( index === ( this.items.length - 1 ) ? undefined : ( index + 1 ) );

        this.current = this.items[ index ];
        this.data.position.end = this.current.position;

        this.place( this.current.position );
    }

    previous() {

        if ( this.data.indexes.previous !== undefined ) {
            this.slide( this.data.indexes.previous );
        }
    }

    next() {

        if ( this.data.indexes.next !== undefined ) {
            this.slide( this.data.indexes.next );
        }
    }

    place( position ) {

        this.data.position.current = position;
        this.list.style.transform = `translate3d(${position}px, 0, 0)`;
    }

    center() {
        
        this.animate( true );

        const position = this.data.position.movement;

        if ( position < 100 && ( this.data.indexes.previous !== undefined ) ) {
            this.previous();
        }
        else if ( position > -100 && ( this.data.indexes.next !== undefined ) ) {
            this.next();
        }
        else {
            this.slide( this.data.indexes.current );
        }
    }

    update( position ) {
        this.data.position.movement = ( this.data.position.start - position ) * 1.6;
        return ( this.data.position.end - this.data.position.movement );
    }

    stop( event ) {

        this.events.move.forEach( ( event ) => {
            this.wrapper.removeEventListener( event, this.move );
        } );
        
        this.data.position.end = this.data.position.current;

        this.center();
    }

    animate( a ) {
        this.list.style.transition = ( a ? 'transform .2s' : '' );
    }
}