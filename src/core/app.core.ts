import express from 'express';
import { Middlewares } from 'core/middlewares.core';
import { Routes } from 'core/routes.core';

class App {
  express = express();

  constructor() {
    Middlewares.common(this.express);

    Routes.tours(this.express);
  }
}

export const app = new App().express;
