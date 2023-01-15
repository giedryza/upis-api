import { Request } from 'express';
import { z } from 'zod';

export class Validation {
  static paginate = (req: Request) =>
    z
      .object({
        page: z.coerce
          .number({
            invalid_type_error: req.t('pagination.errors.page.invalid'),
          })
          .int({ message: req.t('pagination.errors.page.invalid') })
          .positive({ message: req.t('pagination.errors.page.invalid') }),
        limit: z.coerce
          .number({
            invalid_type_error: req.t('pagination.errors.limit.invalid'),
          })
          .int({ message: req.t('pagination.errors.limit.invalid') })
          .positive({ message: req.t('pagination.errors.limit.invalid') }),
      })
      .partial();
}
