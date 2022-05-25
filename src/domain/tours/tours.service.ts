import { Tour } from 'domain/tours/tours.model';
import { SlugService } from 'tools/services';

interface Create {
  body: {
    name: string;
    company: string;
  };
}

export class Service {
  static create = async ({ body }: Create) => {
    const slug = await SlugService.get(body.name);

    const tour = new Tour({
      name: body.name,
      slug,
      company: body.company,
    });

    await tour.save();

    return { data: tour };
  };
}
