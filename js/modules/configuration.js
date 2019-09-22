class Configuration {

    constructor() {

        this.components = {
            reference : 'data-ui-component',
            selector  : '[data-ui-component="%s"]'
        }

        this.classes = {
            active : 'is-active'
        };
    }

    getSelector( type, reference ) {

        switch( type ) {

            case 'class' :
                return `.${this.classes[ reference]}`;

            case 'component' :
                return this.components.selector.replace( '%s', reference );
        }
    }

    getClass( c ) {
        return this.classes[ c ];
    }
}

export default new Configuration();