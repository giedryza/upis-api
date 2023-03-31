import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export class Validation {
  static getOne = (_req: Request) =>
    z.object({
      params: z.object({
        id: z.custom<string>(isValidObjectId).catch(''),
      }),
    });

  static update = (req: Request) =>
    z.object({
      params: z.object({
        id: z.custom<string>(isValidObjectId, {
          message: req.t('images.errors.id.invalid'),
        }),
      }),
      body: z.object({
        description: z.string().optional(),
      }),
    });

  static destroy = (req: Request) =>
    z.object({
      params: z.object({
        id: z.custom<string>(isValidObjectId, {
          message: req.t('images.errors.id.invalid'),
        }),
      }),
    });
}
