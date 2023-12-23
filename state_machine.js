export class State {
  constructor(name) {
    this.name = name;
  }
}

export class StateMachine {
  constructor(model, states, initial, transitions) {
    this.model = model;
    this.states = states;
    this.initial = initial;
    this.transitions = transitions;

    // convert state names to State objects
    for (let i = 0; i < this.states.length; i++) {
      if (typeof states[i] === "string") {
        states[i] = new State(states[i]);
      }
    }

    // initial should be a valid state
    let hasInitial = this._hasState(this.states, this.initial);
    if (!hasInitial) {
      throw new Error("Invalid initial state given");
    }

    this.model.state = this.initial;
    this._addStateQueryMethods();
    this._addStateCallbacks();

    if (this.transitions !== undefined) {
      this._addTransitions(this.transitions);
    }
  }

  addTransition({ trigger, source, dest, before, after, conditions, unless }) {
    if (source !== "*" && !this._hasState(this.states, source)) {
      throw new Error(`No source state ${source} found`);
    }
    if (!this._hasState(this.states, dest)) {
      throw new Error(`No destination state ${dest} found`);
    }

    this.model[trigger] = function () {
      if (source !== "*" && this.state !== source) {
        throw new Error(`Cannot transition from "${this.state}" to "${dest}"`);
      }
      if (conditions !== undefined) {
        for (const condition of conditions) {
          if (!this[condition]()) {
            return;
          }
        }
      }
      if (unless !== undefined) {
        for (const condition of unless) {
          if (this[condition]()) {
            return;
          }
        }
      }
      if (before !== undefined) {
        this[before]();
      }
      const exitCallback =
        "onExit" + this.state[0].toUpperCase() + this.state.substring(1);
      this[exitCallback]();

      this.state = dest;
      const enterCallback =
        "onEnter" + this.state[0].toUpperCase() + this.state.substring(1);
      this[enterCallback]();
      if (after !== undefined) {
        this[after]();
      }
    };
    this.model[trigger].bind(this.model);
  }

  _hasState(states, state) {
    let found = false;
    states.forEach((s) => {
      if (s.name === state) found = true;
    });
    return found;
  }

  _addStateQueryMethods() {
    // for every state 'someState' adds a isSomeState() method to the model
    for (const state of this.states) {
      const queryMethod =
        "is" + state.name[0].toUpperCase() + state.name.substring(1);
      this.model[queryMethod] = function () {
        return this.state === state.name;
      };
      this.model[queryMethod].bind(this.model);
    }
  }

  _addStateCallbacks() {
    // each state is a State() class
    for (const state of this.states) {
      const name = state.name;

      // on enter state callback
      const enterCallback =
        "onEnter" + name[0].toUpperCase() + name.substring(1);
      if (state.hasOwnProperty("onEnter")) {
        this.model[enterCallback] = this.model[state.onEnter];
      } else {
        this.model[enterCallback] = function () {};
      }

      // on exit state callback
      const exitCallback = "onExit" + name[0].toUpperCase() + name.substring(1);
      if (state.hasOwnProperty("onExit")) {
        this.model[exitCallback] = this.model[state.onExit];
      } else {
        this.model[exitCallback] = function () {};
      }
    }
  }

  _addTransitions(transitions) {
    for (const transition of transitions) {
      this.addTransition(transition);
    }
  }
}
