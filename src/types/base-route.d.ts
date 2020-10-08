import { Router } from 'express';

export interface BaseRoute {
  router: Router;
  name: string;
  init: () => void;
}
