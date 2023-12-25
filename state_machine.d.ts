export declare class State {
  constructor(name: string);
  name: string;
}

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

export declare class StateMachine {
  constructor(
    model: any,
    states: Array<string | State>,
    initial: string,
    transitions?: Transition[]
  );

  /**
   * Register a trigger (function) to move from source -> dest. Both source and
   * dest should be valid states. If the source state is '\*', always allows
   * the transitions. Callback execution order:
   *  - transition.conditions
   *  - transition.unless
   *  - transition.before
   *  - source.exit
   *  - dest.enter
   *  - transition.after
   */
  addTransition(t: Transition): void;
}
