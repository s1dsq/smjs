import { StateMachine } from "../state_machine.js";

// The final state machine implemented in this article
// https://www.embeddedrelated.com/showarticle/543.php

class DishWasher {
  machine: StateMachine;
  dirtyDishes: number;
  constructor() {
    this.machine = new StateMachine(
      this,
      ["init", "getDish", "scrub", "rinse", "dry", "cleanup"],
      "init",
      [
        { trigger: "getDirtyDish", source: "init", dest: "getDish" },
        { trigger: "scrubDish", source: "getDish", dest: "scrub" },
        { trigger: "noDirtyDishFound", source: "getDish", dest: "cleanup" },
        { trigger: "dishClean", source: "scrub", dest: "rinse" },
        { trigger: "dishRinsed", source: "rinse", dest: "dry" },
        { trigger: "dishDriedPickUpNew", source: "dry", dest: "getDish" },
      ]
    );
    this.dirtyDishes = 0;
  }

  onEnterInit() {}

  getDirtyDish() {
    console.log("getting dirty dish");
    this.dirtyDishes += 1;
  }

  scrubDish() {
    console.log("scrubbing dish");
  }

  noDirtyDishFound() {
    console.log("no dishes. Time to clean up!");
  }

  dishClean() {
    console.log("time to rinse!");
  }

  dishRinsed() {
    console.log("time to dry!");
  }

  dishDriedPickUpNew() {
    this.dirtyDishes -= 1;
    console.log("picking up new dishes to scrub");
  }
}

enum OP {
  EXIT_NORMAL,
  EXIT_UNKNOWN,
  EXIT_LL_INIT_FAILURE,
  EXIT_INTERNAL_FAULT,
  EXIT_BATHROOM,
  NORMAL_OPERATION,
}

function llInit() {
  console.log("initializing low level stuff");
  return OP.NORMAL_OPERATION;
}

function getTowels() {
  console.log("getting towels");
}

function fillSink() {
  console.log("filling sink");
}

function stackDishes() {
  console.log("stacking dishes");
}

function pickUpDish() {
  const choice = Math.floor(Math.random() * 2);
  return ["dirty", ""][choice];
}

function scrub(dish: string) {
  console.log("scrubbing", dish, "dish");
}

function rinse(dish: string) {
  console.log("rinsing", dish, "dish");
}

function dry(dish: string) {
  console.log("drying", dish, "dish");
}

function putAwayDish(dish: string) {
  console.log("putting away", dish);
}

function returnDish(dish: string) {
  console.log("returning dish", dish);
}

let bathroomBreakNeeded = 0;

function bathroomBreak() {
  bathroomBreakNeeded = 1;
}

async function waitForTimeout(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  let dw = new DishWasher();
  let exitCode = llInit();
  let dish = "";
  dw["state"] = "init";

  while (exitCode === OP.NORMAL_OPERATION) {
    await waitForTimeout(1000);

    // state independent code
    if (bathroomBreakNeeded === 1) {
      if (dish) {
        returnDish(dish);
      }
      exitCode = OP.EXIT_BATHROOM;
      continue;
    }

    // state dependent code
    switch (dw["state"]) {
      case "init":
        getTowels();
        fillSink();
        stackDishes();
        dw.getDirtyDish();
        break;
      case "getDish":
        dish = pickUpDish();
        console.log("dish", dish);
        if (!dish) {
          dw.noDirtyDishFound();
        } else {
          dw.scrubDish();
        }
        break;
      case "scrub":
        if (dish == "dirty") {
          scrub(dish);
        } else {
          dw.dishClean();
        }
        break;
      case "rinse":
        if (dish == "soapy") {
          rinse(dish);
        } else {
          dw.dishRinsed();
        }
        break;
      case "dry":
        if (dish == "wet") {
          dry(dish);
        } else {
          putAwayDish(dish);
          dw.dishDriedPickUpNew();
        }
        break;
      case "cleanup":
        exitCode = OP.EXIT_NORMAL;
        break;
      // Error Conditions - these should never happen, so shut down immediately.
      default:
        exitCode = OP.EXIT_INTERNAL_FAULT;
        if (dish) {
          returnDish(dish); // Unsure what state the dish is in, return it to the dirty pile
        }
        break;
    }
  }
  return exitCode;
}

main();
