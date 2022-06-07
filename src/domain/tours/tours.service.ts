import { Tour } from 'domain/tours/tours.model';
import { TourRecord } from 'domain/tours/tours.types';
import { BadRequestError } from 'errors';
import { SlugService } from 'tools/services';

interface GetOne {
  id?: string;
}

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

interface Destroy {
  id: string;
}

export class Service {
  static getOne = async ({
    id,
  }: GetOne): Promise<{ data: TourRecord | null }> => {
    if (!id) return { data: null };

    const tour = await Tour.findById(id).populate(['company']).lean();

    if (!tour) return { data: null };

    return { data: tour };
  };

  static create = async ({ body }: Create): Promise<{ data: TourRecord }> => {
    const slug = await SlugService.get(body.name);

    const tour = new Tour({
      name: body.name,
      slug,
      company: body.company,
    });

    await tour.save();

    return {
      data: tour,
    };
  };

  static update = async ({
    id,
    body,
  }: Update): Promise<{ data: TourRecord }> => {
    const slug = await SlugService.get(body.name ?? '');

    const tour = await Tour.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(slug && { slug }),
      },
      { new: true }
    )
      .populate(['company'])
      .lean();

    if (!tour) {
      throw new BadRequestError('Failed to update the record.');
    }

    return {
      data: tour,
    };
  };

  static destroy = async ({ id }: Destroy): Promise<void> => {
    const tour = await Tour.findByIdAndDelete(id).lean();

    if (!tour) {
      throw new BadRequestError('Failed to delete the record.');
    }
  };
}
