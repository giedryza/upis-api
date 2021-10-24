import { Request, Response } from 'express';
import { Helpers } from 'common/helpers';
import { Body } from 'domain/social-links/social-links.types';
import { Service } from 'domain/social-links/social-links.service';
import { CreatedResponse } from 'responses/created.response';
import { NoContentResponse } from 'responses/no-content.response';

class Controller {
  create = async (req: Request<{}, {}, Body.create>, res: Response) => {
    const body = Helpers.getBody<Body.create>(req);

    const { data } = await Service.create({
      body,
    });

    return new CreatedResponse(res, data).send();
  };

  destroy = async (req: Request, res: Response) => {
    const { id = '' } = req.params;

    await Service.destroy({ id });

    return new NoContentResponse(res).send();
  };
}

export const controller = new Controller();
