'use strict';

function isFunction( value ) {

    return (!!value && value.constructor === Function);
}

function isPromise( value ) {

    return ((!!value && isFunction( value.then ) && isFunction( value.catch ) ));
}

function clone( value ) {

    return Object.assign( {}, value );
}

module.exports = {

    clone,

    isObject: require( './is_object' ),

    isString: require( './is_string' ),

    isArray: Array.isArray,

    isFunction,

    isPromise,

    parseBoolean: require( './parse_boolean' ),

    templateString: require( './template_string' )
};
