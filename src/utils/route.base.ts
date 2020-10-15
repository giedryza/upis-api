import { Router } from 'express';

export abstract class BaseRoute {
  abstract router: Router;

  abstract path: string;

  protected abstract init: () => void;
}
