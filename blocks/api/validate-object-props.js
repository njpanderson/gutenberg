/**
 * @typedef {object} ObjectPropertySchema
 * @description
 * Each property in the passed argument should be a key/value pair of the name
 * of the variable being tested, and its testing function with the value in an array.
 * @example
 * import Validator from './validate-object-props';
 * const validation = Validator.validate( {
 * 	name: [ Validator.string.isRequired, name ],
 * 	save: [ Validator.func.isRequired, settings.save ],
 * }, name, 'block' );
 */

/**
 * Takes multiple functions and returns a function which invokes them consecutively
 * with the same argument signature: (prop) `value`, `propname`, `entityName`.
 * @returns {function} A function which invokes the passed functions consecutively.
 */
function chain() {
	const args = Array.prototype.slice.call( arguments );

	return function( value, propname, entityType, entityName ) {
		let a, fn, result;

		// Run each function in the chain
		for ( a = 0; ( fn = args[ a ] ); a += 1 ) {
			if ( typeof fn === 'function' ) {
				if ( ( result = fn.apply( this, [ value, propname, entityType, entityName ] ) ) !== true ) {
					// Result of the function is not true, return the error message
					return result;
				}
			}
		}

		// Every function passed, return true
		return true;
	};
}

/**
 * Asserts the `test` value is truthy.
 * @param {boolean} test - Test expression result
 * @param {string} propname - The name of the property being tested
 * @param {string} message - The message, in case of failure. Will be appended to a general
 * error message.
 * @param {string} [entityType] - The type of the entity being tested. E.g: 'block'.
 * @param {string} [entityName] - The name of the entity being tested
 * @returns {bool|string} `true` if the assertion succeeded, otherwise a string containing
 * the error message.
 */
function assert( test, propname, message, entityType, entityName ) {
	if ( ! test ) {
		if ( entityName ) {
			return `Error in entity "${ entityName }" (${ entityType }) ` +
				`property "${ propname }". ${ message }`;
		}

		if ( ! entityName ) {
			return `Error in entity (${ entityType }) property "${ propname }". ${ message }`;
		}
	}

	return true;
}

/**
 * Validates object props in order.
 * @param {ObjectPropertySchema} schema - The property schema.
 * @param {string} entityType - The type of the entity.
 * @param {string} entityName - The name of the entity.
 * @return {bool|string} `true` if no errors were encountered, or a string containing
 * the error message
 */
function validate( schema, entityType, entityName ) {
	let key, result;

	for ( key in schema ) {
		if ( schema.hasOwnProperty( key ) ) {
			if ( ( result = schema[ key ][ 0 ](
					schema[ key ][ 1 ],
					key,
					entityType,
					entityName || null
				) ) !== true ) {
				return result;
			}
		}
	}

	return true;
}

function isRequired( value, prop, entityType, entityName ) {
	return assert(
		( typeof value !== 'undefined' ), prop, 'Value is required.', entityType, entityName
	);
}

function stringNotEmpty( value, prop, entityType, entityName ) {
	return assert(
		( typeof value !== 'undefined' && value !== '' ),
		prop,
		'Value cannot be empty.',
		entityType,
		entityName
	);
}

function string( value, prop, entityType, entityName ) {
	return assert(
		( typeof value === 'undefined' || typeof value === 'string' ),
		prop,
		'Value must be a string.',
		entityType,
		entityName
	);
}

string.isRequired = chain( string, isRequired );
string.notEmpty = chain( string, stringNotEmpty );
string.notEmpty.isRequired = chain( string, stringNotEmpty, isRequired );

function func( value, prop, entityType, entityName ) {
	return assert(
		( typeof value === 'undefined' || typeof value === 'function' ),
		prop,
		'Value must be a function.',
		entityType,
		entityName
	);
}

func.isRequired = chain( func, isRequired );

function object( value, prop, entityType, entityName ) {
	return assert(
		( typeof value === 'undefined' || typeof value === 'object' ),
		prop,
		'Value must be an object.',
		entityType,
		entityName
	);
}

object.isRequired = chain( object, isRequired );

function array( value, prop, entityType, entityName ) {
	return assert(
		Array.isArray( value ), prop, 'Value must be an array.', entityType, entityName
	);
}

array.isRequired = chain( array, isRequired );

function arrayOf() {}

arrayOf.string = chain(
	// test for an array
	array,
	// test array values are all strings
	( value, prop, entityType, entityName ) => {
		let test = true,
			a;

		for ( a = 0; a < value.length; a += 1 ) {
			test = ( test ? ( typeof value[ a ] === 'string' ) : test );
		}

		return assert(
			test,
			prop,
			'Value must be an array containing only strings.',
			entityType,
			entityName,
		);
	}
);

arrayOf.string.isRequired = chain( arrayOf.string, isRequired );

export default {
	_chain: chain,
	_assert: assert,
	validate,
	string,
	object,
	array,
	arrayOf,
	isRequired,
	func,
	stringNotEmpty,
};
