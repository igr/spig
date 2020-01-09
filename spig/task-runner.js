"use strict";

const taskClean = require("./tasks/clean");
const taskBuild = require("./tasks/build");
const taskServe = require("./tasks/serve");
const taskWatch = require("./tasks/watch");
const log = require("./log");

function createTasks(tr) {
  return {
    "clean": taskClean,
    "build": taskBuild,
    "serve": taskServe,
    "watch": taskWatch,
    "serve+watch": () => tr._parallel(["serve", "watch"]),
    "dev": () => tr._serial(["build", "serve+watch"])
  };
}

class TaskRunner {

  /**
   * Short tasks don't require the SPIG definition loaded.
   * todo Make this better.
   */
  static isShortTask(taskname) {
    if (taskname === 'build' || taskname === 'watch' || taskname === 'dev') {
      return false;
    }
    return true;
  }

  constructor() {
    this.tasks = createTasks(this);
  }

  runTask(taskName) {
    const taskFunction = this.tasks[taskName];

    if (!taskFunction) {
      throw new Error("Task not defined: " + taskName)
    }
    taskFunction();
  }

  /**
   * Runs list of tasks in serial manner.
   */
  _serial(taskNames) {
    for (const t of taskNames) {
      this.runTask(t);
    }
  }

  /**
   * Runs list of tasks in parallel manner.
   */
  _parallel(taskNames) {
    (async () => {
      const allPromises = [];

      for (const t of taskNames) {
        allPromises.push(
          new Promise((resolve, reject) => {
            try {
              this.runTask(t);
              resolve();
            } catch (e) {
              reject(e);
            }
          })
        );
      }
      await Promise.all(allPromises).catch(e => log.error(e));
    })();
  }

}

module.exports = TaskRunner;
