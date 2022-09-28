import { Request, Response } from 'express';

import { ValidatorService } from 'tools/services';
import { SocialLinkType } from 'domain/social-links/social-links.types';
import { Service } from 'domain/social-links/social-links.service';
import {
  CreatedResponse,
  NoContentResponse,
  SuccessResponse,
  ListResponse,
} from 'responses';

interface GetOne {
  params: {
    id: string;
  };
}

interface Create {
  body: {
    type: SocialLinkType;
    url: string;
    host: string;
  };
}

interface Update {
  params: {
    id: string;
  };
  body: {
    type: SocialLinkType | undefined;
    url: string | undefined;
  };
}

interface Destroy {
  params: {
    id: string;
  };
}

class Controller {
  getAll = async (req: Request, res: Response) => {
    const { query } = req;

    const { data, meta } = await Service.getAll({ query });

    return new ListResponse(res, data, meta).send();
  };

  getOne = async (req: Request, res: Response) => {
    const { params } = ValidatorService.getData<GetOne['params']>(req);

    const { data } = await Service.getOne({
      data: {
        id: params.id,
      },
    });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<{}, Create['body']>(req);

    const { data } = await Service.create({
      data: body,
      t: req.t,
    });

    return new CreatedResponse(res, data).send();
  };

  update = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      Update['params'],
      Update['body']
    >(req);

    const { data } = await Service.update({
      data: {
        id: params.id,
        ...body,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  destroy = async (req: Request, res: Response) => {
    const { params } = ValidatorService.getData<Destroy['params']>(req);

    await Service.destroy({
      data: {
        id: params.id,
      },
      t: req.t,
    });

    return new NoContentResponse(res).send();
  };
}

export const controller = new Controller();
