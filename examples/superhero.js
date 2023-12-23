import { StateMachine } from "../state_machine.js";

export class NarcolepticSuperhero {
  static states = [
    "asleep",
    "hangingOut",
    "hungry",
    "sweaty",
    "savingTheWorld",
  ];
  constructor(name) {
    this.name = name;
    this.kittensRescued = 0;
    this.machine = new StateMachine(
      this,
      NarcolepticSuperhero.states,
      "asleep"
    );
    this.machine.addTransition({
      trigger: "wakeUp",
      source: "asleep",
      dest: "hangingOut",
    });
    this.machine.addTransition({
      trigger: "workOut",
      source: "hangingOut",
      dest: "hungry",
    });
    this.machine.addTransition({
      trigger: "eat",
      source: "hungry",
      dest: "hangingOut",
    });
    this.machine.addTransition({
      trigger: "distressCall",
      source: "*",
      dest: "savingTheWorld",
      before: "changeIntoSuperSecretCostume",
    });

    this.machine.addTransition({
      trigger: "completeMission",
      source: "savingTheWorld",
      dest: "sweaty",
      after: "updateJournal",
    });
    this.machine.addTransition({
      trigger: "cleanUp",
      source: "sweaty",
      dest: "asleep",
      conditions: ["isExhausted"],
    });
    this.machine.addTransition({ trigger: "nap", source: "*", dest: "asleep" });
  }

  updateJournal() {
    this.kittensRescued += 1;
  }

  isExhausted() {
    return Math.random() < 0.5;
  }

  changeIntoSuperSecretCostume() {
    console.log("Beauty, eh?");
  }
}

// function main() {
//   const ns = new NarcolepticSuperhero("Superman");
// }

// main();
