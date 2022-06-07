import { Request } from 'express';

import { Tour } from 'domain/tours/tours.model';
import { TourRecord } from 'domain/tours/tours.types';
import { BadRequestError } from 'errors';
import { QueryService, SlugService } from 'tools/services';
import { PaginatedList } from 'types/common';

interface GetOne {
  id?: string;
}

interface GetAll {
  query: Request['query'];
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

  static getAll = async ({
    query,
  }: GetAll): Promise<PaginatedList<TourRecord>> => {
    const { filter, sort, select, page, limit } = new QueryService(query);
    const options = {
      page,
      limit,
      sort,
      select,
      populate: ['company'],
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs: total } = await Tour.paginate(filter, options);

    return {
      data: docs,
      meta: { total, page, limit },
    };
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
