# @nylen/wp-hooks

[![Build Status](https://img.shields.io/travis/nylen/node-wp-hooks/master.svg)](https://travis-ci.org/nylen/node-wp-hooks)
[![Coverage](https://img.shields.io/coveralls/nylen/node-wp-hooks/master.svg)](https://coveralls.io/github/nylen/node-wp-hooks)

**WordPress-style hooks** (_actions_ and _filters_) for Node.js.

When combined with a mechanism for plugin registration and loading (outside the
scope of this library), this is a simple, effective pattern that allows
modifying values or executing other code at key parts in your app.

More information about actions and filters as they are used in WordPress:
https://developer.wordpress.org/plugins/hooks/

## Usage

```js
const WPHooks = require( '@nylen/wp-hooks' );
const hooks = new WPHooks();
```

* **hooks.addAction( 'identifier', callback, priority )** - Add a function to the
  action given by `identifier`. Actions do not have return values.
* **hooks.addFilter( 'identifier', callback, priority )** - Add a function to the
  filter given by `identifier`. Filters have return values, and functions
  hooked into a filter can modify its return value.
* **hooks.removeAction( 'identifier', callback )** - Remove an action.
* **hooks.removeFilter( 'identifier',  callback )** - Remove a filter.
* **hooks.removeAllActions(  'identifier' )** - Remove all actions from the given
  `identifier`.
* **hooks.removeAllFilters(  'identifier' )** - Remove all filters from the given
  `identifier`.
* **hooks.doAction( 'identifier', arg1, ... )** - Run an action along with any
  functions hooked into it.
* **hooks.applyFilters( 'identifier', arg1, ... )** - Run a filter along with any
  functions hooked into it, and return the default value or the value from the
  last function.
* **hooks.doingAction( 'identifier' )** - Whether this object is currently
  executing the action with the name `identifier`.
* **hooks.doingFilter( 'identifier' )** - Whether this object is currently
  executing the filter with the name `identifier`.
* **hooks.didAction( 'identifier' )** - Whether this object has executed the
  action with the name `identifier`.
* **hooks.didFilter( 'identifier' )** - Whether this object has executed the
  filter with the name `identifier`.
* **hooks.hasAction( 'identifier' )** - Whether this object has any functions
  hooked into the action with the name `identifier`.
* **hooks.hasFilter( 'identifier' )** - Whether this object has any functions
  hooked into the filter with the name `identifier`.

In large apps, it is a good idea to enforce separation of different types of
hooks by either prefixing `identifier` hook names with `namespace.identifier`,
or (even better) using separate `hooks` objects for each part of the app.

## Sync or Async?

All filters and actions are **synchronous** by default, and this library
contains no special code for async callbacks or promises.

However, because `async` functions just return `Promise` objects under the
covers, you can easily pass a `Promise` through a chain of hooks.  If you
follow a couple of simple rules, then the final result from `applyFilters` will
be a promise that resolves or fails when all of its attached functions have
finished processing.

For hooks that may require asynchronous behavior, the app can start the filter
chain normally:

```js
const finalValue = await applyFilters(
  'my_async_code_path',
  'defaultValue'
);
```

Then, individual filters can be written as `async` functions, as long as they
adhere to a simple convention:  **Accept a `Promise` as an argument and `await`
it before returning.**

```js
addFilter( 'my_async_code_path', async p => {
  const value = await p;
  return value + '/modified';
} );
```

See `index.test.js` for more examples and information.

Future **major versions** of this library may change the behavior around
asynchronous computations.  Currently this mostly works (with the exception of
`doingFilter` and `didFilter`), but requires adhering to a non-obvious
convention and can be difficult to understand and use effectively.
