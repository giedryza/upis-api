import { Tour } from 'domain/tours/tours.model';
import { TourRecord } from 'domain/tours/tours.types';
import { BadRequestError } from 'errors';
import { SlugService } from 'tools/services';

interface Create {
  body: {
    name: string;
    company: string;
  };
}

interface Update {
  id: string;
  body: {
    name?: string;
    description?: string;
    website?: string;
    departure?: string;
    arrival?: string;
    distance?: number;
    duration?: number;
    days?: number;
    difficulty?: number;
  };
}

export class Service {
  static create = async ({ body }: Create): Promise<{ data: TourRecord }> => {
    const slug = await SlugService.get(body.name);

    const tour = new Tour({
      name: body.name,
      slug,
      company: body.company,
    });

    await tour.save();

    return { data: tour };
  };

  static update = async ({
    id,
    body,
  }: Update): Promise<{ data: TourRecord }> => {
    const tour = await Tour.findByIdAndUpdate(id, body, { new: true })
      .populate(['company'])
      .lean();

    if (!tour) {
      throw new BadRequestError('Failed to update the record.');
    }

    return {
      data: tour,
    };
  };
}
