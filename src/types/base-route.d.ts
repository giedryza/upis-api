import { Router } from 'express';

export interface BaseRoute {
  router: Router;
  path: string;
  init: () => void;
}
