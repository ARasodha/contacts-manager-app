"use strict";

import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

class App {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller(this.model, this.view);
  }
}

document.addEventListener("DOMContentLoaded", event => {
  const app = new App();
});