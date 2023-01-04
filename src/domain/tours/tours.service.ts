import { Request } from 'express';
import { LeanDocument } from 'mongoose';
import { TFunction } from 'i18next';

import { Tour } from 'domain/tours/tours.model';
import { FiltersSummary, Region, TourRecord } from 'domain/tours/tours.types';
import { BadRequestError } from 'errors';
import { filesService, QueryService, SlugService } from 'tools/services';
import { Currency, EntityId, PaginatedList } from 'types/common';
import { Provider } from 'domain/providers/providers.model';
import { Service as ImageService } from 'domain/images/images.service';
import { MAX_PHOTOS } from 'domain/tours/tours.constants';

interface GetAll {
  query: Request['query'];
}

interface GetOne {
  data: {
    id: string;
  };
}

interface Create {
  data: {
    userId: EntityId;
    name: string;
    provider: string;
  };
  t: TFunction;
}

interface Update {
  data: {
    id: string;
    name?: string;
    description?: string;
    website?: string;
    departure?: [number, number];
    arrival?: [number, number];
    distance?: number;
    duration?: number;
    days?: number;
    difficulty?: number;
    primaryPhoto?: string;
  };
  t: TFunction;
}

interface Destroy {
  data: {
    id: string;
  };
  t: TFunction;
}

interface UpdatePrice {
  data: {
    id: string;
    amount?: number;
    currency?: Currency;
  };
  t: TFunction;
}

interface UpdateGeography {
  data: {
    id: string;
    regions: Region[];
    rivers: string[];
  };
  t: TFunction;
}

interface UpdateAmenities {
  data: {
    id: string;
    amenities: string[];
  };
  t: TFunction;
}

interface AddPhoto {
  data: {
    id: string;
    userId: EntityId;
    photo: Request['file'];
    description?: string;
  };
  t: TFunction;
}

export class Service {
  static getOne = async ({
    data: { id },
  }: GetOne): Promise<{ data: LeanDocument<TourRecord> | null }> => {
    const tour = await Tour.findById(id)
      .populate([
        { path: 'provider', populate: 'amenities' },
        { path: 'amenities' },
        { path: 'photos' },
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
      populate: [
        { path: 'provider', populate: 'amenities' },
        { path: 'amenities' },
        { path: 'photos' },
      ],
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs, totalPages } = await Tour.paginate(
      filter,
      options
    );

    return {
      data: docs,
      meta: { total: totalDocs, page, limit, pages: totalPages },
    };
  };

  static create = async ({
    data: { userId, name, provider },
    t,
  }: Create): Promise<{ data: TourRecord }> => {
    const slug = await SlugService.get(name);

    const tour = new Tour({
      name,
      slug,
      provider,
      user: userId,
    });

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.create'));
    }

    await tour.save();

    return {
      data: tour,
    };
  };

  static update = async ({
    data,
    t,
  }: Update): Promise<{ data: LeanDocument<TourRecord> }> => {
    const slug = await SlugService.get(data.name ?? '');

    const { id, arrival, departure, ...update } = data;

    const tour = await Tour.findByIdAndUpdate(
      id,
      {
        ...update,
        ...{
          $set: {
            ...(slug && { slug }),
            ...(!!arrival && { 'arrival.coordinates': arrival }),
            ...(!!departure && { 'departure.coordinates': departure }),
          },
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    return {
      data: tour,
    };
  };

  static destroy = async ({ data: { id }, t }: Destroy): Promise<void> => {
    const tour = await Tour.findByIdAndDelete(id).lean();

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.destroy'));
    }
  };

  static updatePrice = async ({
    data: { id, amount, currency },
    t,
  }: UpdatePrice): Promise<{ data: TourRecord }> => {
    const tour = await Tour.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          price: amount && currency ? { amount, currency } : null,
        },
      },
      { new: true, runValidators: true }
    );

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    return {
      data: tour,
    };
  };

  static updateGeography = async ({
    data: { id, regions, rivers },
    t,
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
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    return {
      data: tour,
    };
  };

  static updateAmenities = async ({
    data: { id, amenities },
    t,
  }: UpdateAmenities): Promise<{ data: TourRecord }> => {
    const tour = await Tour.findById(id);

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    const provider = await Provider.findOne({
      _id: tour.provider,
      ...(!!amenities.length && { amenities: { $all: amenities } }),
    });

    if (!provider) {
      throw new BadRequestError(t('tours.errors.amenities.contain'));
    }

    tour.set('amenities', amenities);
    await tour.save();

    return {
      data: tour,
    };
  };

  static addPhoto = async ({
    data: { id, userId, photo, description },
    t,
  }: AddPhoto): Promise<{ data: LeanDocument<TourRecord> }> => {
    if (!photo) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    const tour = await Tour.findById(id).lean();

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    if (tour.photos.length >= MAX_PHOTOS) {
      await filesService('cloudinary').delete([photo.filename]);

      throw new BadRequestError(
        t('tours.errors.photos.max', { max: MAX_PHOTOS })
      );
    }

    const { data } = await ImageService.create({
      data: {
        file: {
          url: photo.path,
          key: photo.filename,
          contentType: photo.mimetype,
          description,
        },
        user: userId,
      },
      t,
    });

    const updated = await Tour.findByIdAndUpdate(
      id,
      { $push: { photos: data._id } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    return {
      data: updated,
    };
  };

  static getFilters = async (): Promise<{ data: FiltersSummary | null }> => {
    const [summary] = await Tour.aggregate<FiltersSummary>([
      {
        $facet: {
          distance: [
            {
              $group: {
                _id: null,
                min: { $min: '$distance' },
                max: { $max: '$distance' },
              },
            },
            {
              $project: { _id: 0 },
            },
          ],
          duration: [
            {
              $group: {
                _id: null,
                min: { $min: '$duration' },
                max: { $max: '$duration' },
              },
            },
            {
              $project: { _id: 0 },
            },
          ],
          days: [
            {
              $group: {
                _id: null,
                min: { $min: '$days' },
                max: { $max: '$days' },
              },
            },
            {
              $project: { _id: 0 },
            },
          ],
        },
      },
      {
        $project: {
          distance: { $first: '$distance' },
          duration: { $first: '$duration' },
          days: { $first: '$days' },
        },
      },
    ]);

    if (!summary) {
      return { data: null };
    }

    return { data: summary };
  };
}
