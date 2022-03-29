import express from 'express';
import 'express-async-errors';

import { Middlewares, Api } from 'core';

class App {
  expressApp = express();

  constructor() {
    Middlewares.common(this.expressApp);

    Api.v1(this.expressApp);
    Api.all(this.expressApp);

    Middlewares.error(this.expressApp);
  }
}

export const app = new App().expressApp;
