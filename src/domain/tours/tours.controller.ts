import { Request, Response } from 'express';

class Controller {
  getTours = (_req: Request, res: Response) => {
    res.send('all tours');
  };

  addTour = (req: Request, res: Response) => {
    res.send(req.body);
  };
}

export const controller = new Controller();
