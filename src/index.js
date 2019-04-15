const createAddHook     = require( './createAddHook' );
const createRemoveHook  = require( './createRemoveHook' );
const createHasHook     = require( './createHasHook' );
const createRunHook     = require( './createRunHook' );
const createCurrentHook = require( './createCurrentHook' );
const createDoingHook   = require( './createDoingHook' );
const createDidHook     = require( './createDidHook' );

module.exports = function WPHooks() {
	// Ensure this function is used like a constructor.
	if ( ! this instanceof WPHooks ) {
		return new WPHooks();
	}

	// Object for data storage.
	this._hooks = {
		actions: {},
		filters: {},
	};

	// Add action/filter functions.
	this.addAction = createAddHook( this._hooks.actions );
	this.addFilter = createAddHook( this._hooks.filters );

	// Remove action/filter functions.
	this.removeAction = createRemoveHook( this._hooks.actions );
	this.removeFilter = createRemoveHook( this._hooks.filters );

	// Has action/filter functions.
	this.hasAction = createHasHook( this._hooks.actions );
	this.hasFilter = createHasHook( this._hooks.filters );

	// Remove all actions/filters functions.
	this.removeAllActions = createRemoveHook( this._hooks.actions, true );
	this.removeAllFilters = createRemoveHook( this._hooks.filters, true );

	// Do action/apply filters functions.
	this.doAction     = createRunHook( this._hooks.actions );
	this.applyFilters = createRunHook( this._hooks.filters, true );

	// Current action/filter functions.
	this.currentAction = createCurrentHook( this._hooks.actions );
	this.currentFilter = createCurrentHook( this._hooks.filters );

	// Doing action/filter: true while a hook is being run.
	this.doingAction = createDoingHook( this._hooks.actions );
	this.doingFilter = createDoingHook( this._hooks.filters );

	// Did action/filter functions.
	this.didAction = createDidHook( this._hooks.actions );
	this.didFilter = createDidHook( this._hooks.filters );
};
