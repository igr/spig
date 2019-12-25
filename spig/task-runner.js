"use strict";

const taskClean = require("./tasks/clean");
const taskStatic = require("./tasks/static");
const watchStatic = require("./tasks/static").watch;
const taskSass = require("./tasks/sass");
const watchSass = require("./tasks/sass").watch;
const taskScripts = require("./tasks/scripts");
const watchScripts = require("./tasks/scripts").watch;
const taskImages = require("./tasks/images");
const watchImages = require("./tasks/images").watch;
const taskSite = require("./tasks/site");
const taskServe = require("./tasks/serve");
const taskWatch = require("./tasks/watch");

function createTasks(tr) {
  return {
    "clean" : taskClean,
    "static": taskStatic,
    "sass": taskSass,
    "js": taskScripts,
    "images": taskImages,
    "site": taskSite,
    "serve": taskServe,
    "watch": () => taskWatch([watchSass, watchStatic, watchScripts, watchImages]),
    "build": () => tr._parallel(["static", "sass", "js", "site", "images"]),
    "serve+watch": () => tr._parallel(["serve", "watch"]),
    "dev": () => tr._serial(["build", "serve+watch"])
  };
}

class TaskRunner {

  constructor(phases) {
    this.ctx = {
      phases: phases
    };
    this.tasks = createTasks(this);
  }

  runTask(taskName) {
    if (!taskName) {
      taskName = "build";
    }
    const taskFunction = this.tasks[taskName];

    if (!taskFunction) {
      throw new Error("Task not defined: " + taskName)
    }
    taskFunction(this.ctx);
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
          new Promise((resolve) => {
            this.runTask(t);
            resolve();
          })
        );
      }
      await Promise.all(allPromises);
    })();
  }

}

module.exports = TaskRunner;
