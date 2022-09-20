import { Request } from 'express';
import { LeanDocument } from 'mongoose';

import { Tour } from 'domain/tours/tours.model';
import { Region, TourRecord } from 'domain/tours/tours.types';
import { BadRequestError } from 'errors';
import { QueryService, SlugService } from 'tools/services';
import { Currency, PaginatedList } from 'types/common';
import { Company } from 'domain/companies/companies.model';

interface GetOne {
  id?: string;
}

interface GetAll {
  query: Request['query'];
}

interface Create {
  userId: string;
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

interface UpdatePrice {
  id: string;
  body: {
    amount?: number;
    currency?: Currency;
  };
}

interface UpdateGeography {
  id: string;
  body: {
    regions: Region[];
    rivers: string[];
  };
}

interface UpdateAmenities {
  id: string;
  amenities: string[];
}

export class Service {
  static getOne = async ({
    id,
  }: GetOne): Promise<{ data: LeanDocument<TourRecord> | null }> => {
    if (!id) return { data: null };

    const tour = await Tour.findById(id)
      .populate([
        { path: 'company', populate: 'amenities' },
        { path: 'amenities' },
      ])
      .lean();

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
      populate: ['company', 'amenities'],
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs: total } = await Tour.paginate(filter, options);

    return {
      data: docs,
      meta: { total, page, limit },
    };
  };

  static create = async ({
    userId,
    body,
  }: Create): Promise<{ data: TourRecord }> => {
    const slug = await SlugService.get(body.name);

    const tour = new Tour({
      name: body.name,
      slug,
      company: body.company,
      user: userId,
    });

    await tour.save();

    return {
      data: tour,
    };
  };

  static update = async ({
    id,
    body,
  }: Update): Promise<{ data: LeanDocument<TourRecord> }> => {
    const slug = await SlugService.get(body.name ?? '');

    const tour = await Tour.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(slug && { slug }),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!tour) {
      throw new BadRequestError('Tour does not exist.');
    }

    return {
      data: tour,
    };
  };

  static destroy = async ({ id }: Destroy): Promise<void> => {
    const tour = await Tour.findByIdAndDelete(id).lean();

    if (!tour) {
      throw new BadRequestError('Tour does not exist.');
    }
  };

  static updatePrice = async ({
    id,
    body: { amount, currency },
  }: UpdatePrice): Promise<{ data: TourRecord }> => {
    const tour = await Tour.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          price:
            amount && currency
              ? {
                  amount,
                  currency,
                }
              : null,
        },
      },
      { new: true, runValidators: true }
    );

    if (!tour) {
      throw new BadRequestError('Tour does not exist.');
    }

    return {
      data: tour,
    };
  };

  static updateGeography = async ({
    id,
    body: { regions, rivers },
  }: UpdateGeography): Promise<{ data: TourRecord }> => {
    const tour = await Tour.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...(!!regions && { regions }),
          ...(!!rivers && { rivers }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!tour) {
      throw new BadRequestError('Tour does not exist.');
    }

    return {
      data: tour,
    };
  };

  static updateAmenities = async ({
    id,
    amenities,
  }: UpdateAmenities): Promise<{ data: TourRecord }> => {
    const tour = await Tour.findById(id);

    if (!tour) {
      throw new BadRequestError('Tour does not exist.');
    }

    const company = await Company.findOne({
      _id: tour.company,
      ...(amenities.length && { amenities: { $all: amenities } }),
    });

    if (!company) {
      throw new BadRequestError(
        'Company does not contain one or more amenities you are trying to add to the tour.'
      );
    }

    tour.set('amenities', amenities);
    await tour.save();

    return {
      data: tour,
    };
  };
}
