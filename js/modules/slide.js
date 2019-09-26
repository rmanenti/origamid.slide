import configuration from './configuration.js';
import Events        from  './events.js';

export class Slide {

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

        this.onChange = new Event( 'onChange');
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

            window.addEventListener( 'resize', this.resize );

            this.store();
            this.center();
        }
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

    slide( index ) {

        if ( this.current ) {
            this.current.item.classList.remove( configuration.getClass( 'active' ) );
        }

        this.current = this.items[ index ];
        this.data.position.end = this.current.position;

        this.data.indexes.previous = ( index ? ( index - 1 ) : undefined );
        this.data.indexes.current  = index;
        this.data.indexes.next     = ( index === ( this.items.length - 1 ) ? undefined : ( index + 1 ) );

        this.animate( true );
        this.current.item.classList.add( configuration.getClass( 'active' ) );

        this.place( this.current.position );

        this.wrapper.dispatchEvent( this.onChange );
    }

    place( position ) {

        this.data.position.current = position;
        this.list.style.transform = `translate3d(${position}px, 0, 0)`;
    }

    center() {
        
        const position = this.data.position.movement;

        if ( position > 0 ) {
            this.next();
        }
        else if ( position < 0  ) {
            this.previous();
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

    resize() {

        setTimeout( () => {

            this.store();
            this.slide( this.data.indexes.current );
        }, 550 );
    }

    store() {

        this.items = [ ...this.list.children ].map( ( item ) => {

            const position = -( item.offsetLeft - ( ( this.wrapper.offsetWidth - item.offsetWidth ) / 2 ) );

            return {
                item,
                position
            }
        } );
    }

    bindings() {
        
        this.start  = this.start.bind( this );
        this.move   = this.move.bind( this );
        this.stop   = this.stop.bind( this );        

        this.previous = this.previous.bind( this );
        this.next     = this.next.bind( this );

        this.resize = Events.debounce( this.resize.bind( this ), 200 );
    }
}

export class NavSlide extends Slide {

    constructor( wrapper, list ) {

        super( wrapper, list );
        this.bindings();
    }

    create( type, p, n ) {

        switch( type ) {

            case 'navigation' :

                this.buttonPrevious = document.querySelector( configuration.getSelector( 'component', p ) );
                this.buttonNext     = document.querySelector( configuration.getSelector( 'component', n ) );

                this.buttonPrevious.addEventListener( 'click', this.previous );
                this.buttonNext.addEventListener( 'click', this.next );
                
                break;

            case 'pagination' :
            
                this.controls = document.createElement( 'ul' );
                this.controls.dataset.uiComponent = 'slide-pagination';

                this.items.forEach( ( item, index ) => {

                    let src = item.item.querySelector( 'img' ).src;
                    src = src.replace( '.jpg', '-thumb.jpg' );
                    
                    this.controls.innerHTML += `<li><a data-ui-slide-pagination-index="${index}" href="#slide-${index}"><img src="${src}"></a></li>`;
                } );

                this.controlItems = [...this.controls.children];
                this.controlItems.forEach( this.paginate );

                document.body.insertBefore( this.controls, this.wrapper );

                this.activate();

                this.wrapper.addEventListener( 'onChange', this.activate );
        }

        return this;
    }    

    paginate( item, index ) {

        item.addEventListener( 'click', ( event ) => {

            event.preventDefault();
            this.slide( index );
            this.activate();
        } );
    }

    activate() {

        this.controlItems.forEach( ( item ) => {
            item.classList.remove( configuration.getClass( 'active' ) );
        } );

        this.controlItems[ this.data.indexes.current ].classList.add( configuration.getClass( 'active' ) );
    }

    bindings() {

        super.bindings();
        this.paginate = this.paginate.bind( this );
        this.activate = this.activate.bind( this );
    }

}