import configuration     from './modules/configuration.js';
import {Slide, NavSlide} from './modules/slide.js';

const slide = new NavSlide( 'slide', 'slide-list' );
slide.initialize();
slide.create( 'navigation', 'slide-navigation-previous', 'slide-navigation-next' )
     .create( 'pagination' );

