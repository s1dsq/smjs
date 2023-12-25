# A small state machine library

This is a javascript port of
[this](https://github.com/pytransitions/transitions) library. The difference is
this retains a tiny feature set of the original python implementation providing
only the core and some other things. The user can extend it to their needs if
they so desire.

## Usage

```javascript
import { StateMachine } from './state_machine.js';
class Model {
  constructor() {
    this.machine = new StateMachine(
      this,
      ['asleep', 'hangingOut', 'hungry', 'sweaty', 'savingTheWorld'],
      'asleep'
    );
    this.machine.addTransition({
      trigger: 'wakeUp',
      source: 'asleep',
      dest: 'hangingOut',
    });
    this.machine.addTransition({ trigger: 'nap', source: '*', dest: 'asleep' });
  }
}
```

The core is just a `addTransition` function to add state transitions (these can
also be added as a parameter to the `StateMachine` constructor. The signature of
the function is:

```javascript
/**
 * @param {string} trigger - trigger function name.
 * @param {string} source - valid source state.
 * @param {string} dest - valid destination state.
 * @param {string} before - function to run before state transition.
 * @param {string} after - function to run after state transition.
 * @param {string[]} conditions - abort if any of the functions returns false.
 * @param {string[]} unless - abort if any of the functions returns true.
 */
export type Transition = {
  trigger: string;
  source: string;
  dest: string;
  before?: string;
  after?: string;
  conditions?: string[];
  unless?: string[];
};
```

Check the typescript declaration file for more details. Example programs can be
found in the `examples` directory

For every state `someState` methods such as:
- `isSomeState` (is the current state someState)
- `onEnterSomeState` (fired every time we enter someState, except at the very beginning)
- `onExitSomeState` (fired every time we leave someState)
are added on initialization. It is recommended to not use spaces between state
names to avoid awkward method calls at runtime (`this.isSomeState()` instead of
`this['isSome State']`)

## Credits
[pytransitions/transitions](https://github.com/pytransitions/transitions) for
the state machine core and also some examples

## LICENSE

MIT
