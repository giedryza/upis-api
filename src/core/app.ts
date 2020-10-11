import express from 'express';
import { Middlewares } from 'core/middlewares';
import { Api } from 'core/api';

class App {
  expressApp = express();

  constructor() {
    Middlewares.common(this.expressApp);

    Api.v1(this.expressApp);
  }
}

export const app = new App().expressApp;
