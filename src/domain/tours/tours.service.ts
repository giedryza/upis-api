import { Request } from 'express';
import { LeanDocument } from 'mongoose';
import { TFunction } from 'i18next';
import { z } from 'zod';

import { BadRequestError } from 'errors';
import { filesService, SlugService } from 'tools/services';
import { Currency, EntityId } from 'types/common';
import { Provider } from 'domain/providers/providers.model';
import { Service as ImageService } from 'domain/images/images.service';
import { PaginatedList } from 'domain/pagination/pagination.types';
import { Amenity } from 'domain/amenities/amenities.model';

import { Tour } from './tours.model';
import { FiltersSummary, Region, TourRecord } from './tours.types';
import { MAX_PHOTOS } from './tours.constants';
import { Validation } from './tours.validation';

interface GetAll {
  query: z.infer<ReturnType<typeof Validation.getAll>>['query'];
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
    userId: string;
    photo: Request['file'];
    description?: string;
  };
  t: TFunction;
}

interface GetFilters {
  t: TFunction;
}

export class Service {
  static getOne = async ({
    data: { id },
  }: GetOne): Promise<{ data: LeanDocument<TourRecord> | null }> => {
    if (!id) return { data: null };

    const tour = await Tour.findById(id)
      .populate([
        { path: 'provider', populate: ['amenities'] },
        { path: 'amenities', populate: '_id' },
        { path: 'photos' },
      ])
      .lean();

    if (!tour) return { data: null };

    return { data: tour };
  };

  static getAll = async ({
    query,
  }: GetAll): Promise<PaginatedList<TourRecord>> => {
    const {
      amenities,
      regions,
      rivers,
      distanceFrom,
      distanceTo,
      durationFrom,
      durationTo,
      daysFrom,
      difficultyFrom,
      difficultyTo,
      departure,
      daysTo,
      bounds,
      providers,
      user,
      page = 1,
      limit = 15,
      select,
      populate,
    } = query;
    const filters = [
      ...(regions ? [{ regions: { $in: regions } }] : []),
      ...(rivers ? [{ rivers: { $in: rivers } }] : []),
      ...(amenities ? [{ 'amenities.variant': { $all: amenities } }] : []),
      ...(distanceFrom !== undefined
        ? [{ distance: { $gte: distanceFrom } }]
        : []),
      ...(distanceTo !== undefined ? [{ distance: { $lte: distanceTo } }] : []),
      ...(durationFrom !== undefined
        ? [{ duration: { $gte: durationFrom } }]
        : []),
      ...(durationTo !== undefined ? [{ duration: { $lte: durationTo } }] : []),
      ...(daysFrom !== undefined ? [{ days: { $gte: daysFrom } }] : []),
      ...(daysTo !== undefined ? [{ days: { $lte: daysTo } }] : []),
      ...(difficultyFrom !== undefined
        ? [{ difficulty: { $gte: difficultyFrom } }]
        : []),
      ...(difficultyTo !== undefined
        ? [{ difficulty: { $lte: difficultyTo } }]
        : []),
      ...(departure ? [{ 'departure.coordinates': { $size: 2 } }] : []),
      ...(bounds
        ? [
            {
              departure: {
                $geoWithin: {
                  $geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [bounds[1], bounds[0]],
                        [bounds[1], bounds[2]],
                        [bounds[3], bounds[2]],
                        [bounds[3], bounds[0]],
                        [bounds[1], bounds[0]],
                      ],
                    ],
                  },
                },
              },
            },
          ]
        : []),
      ...(providers ? [{ provider: { $in: providers } }] : []),
      ...(user ? [{ user }] : []),
    ];
    const options = {
      page,
      limit,
      sort: { score: -1, createdAt: 1 },
      select,
      populate: populate
        ? [
            ...(populate.includes('provider')
              ? [
                  {
                    path: 'provider',
                    ...(populate.includes('provider.amenities')
                      ? [{ populate: 'amenities' }]
                      : []),
                  },
                ]
              : []),
            ...(populate.includes('amenities')
              ? [{ path: 'amenities', populate: '_id' }]
              : []),
            ...(populate.includes('photos') ? [{ path: 'photos' }] : []),
          ]
        : undefined,
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs, totalPages } = await Tour.paginate(
      { ...(filters.length && { $and: filters }) },
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

    const tour = await Tour.findById(id);

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    tour.set({
      ...update,
      ...(slug && { slug }),
      ...(!!arrival && { 'arrival.coordinates': arrival }),
      ...(!!departure && { 'departure.coordinates': departure }),
    });

    await tour.save();

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
    const tour = await Tour.findById(id);

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    tour.set({
      price: amount && currency ? { amount, currency } : null,
    });
    await tour.save();

    return {
      data: tour,
    };
  };

  static updateGeography = async ({
    data: { id, regions, rivers },
    t,
  }: UpdateGeography): Promise<{ data: TourRecord }> => {
    const tour = await Tour.findById(id);

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    tour.set({
      ...(!!regions && { regions }),
      ...(!!rivers && { rivers }),
    });
    await tour.save();

    return {
      data: tour,
    };
  };

  static updateAmenities = async ({
    data: { id, amenities: amenityIds },
    t,
  }: UpdateAmenities): Promise<{ data: TourRecord }> => {
    const tour = await Tour.findById(id);

    if (!tour) {
      throw new BadRequestError(t('tours.errors.id.update'));
    }

    const provider = await Provider.findOne({
      _id: tour.provider,
      ...(!!amenityIds.length && { amenities: { $all: amenityIds } }),
    });

    if (!provider) {
      throw new BadRequestError(t('tours.errors.amenities.contain'));
    }

    const amenities = await Amenity.find({ _id: { $in: amenityIds } });

    if (!amenities) {
      throw new BadRequestError(t('tours.errors.amenities.contain'));
    }

    tour.set({
      amenities: amenities.map((amenity) => ({
        _id: amenity._id,
        variant: amenity.variant,
      })),
    });
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

    const tour = await Tour.findById(id);

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

    tour.set({
      photos: [...tour.photos, data.id],
    });
    await tour.save();

    return {
      data: tour,
    };
  };

  static getFilters = async ({
    t,
  }: GetFilters): Promise<{ data: FiltersSummary }> => {
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
          difficulty: [
            {
              $group: {
                _id: null,
                min: { $min: '$difficulty' },
                max: { $max: '$difficulty' },
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
          difficulty: { $first: '$difficulty' },
        },
      },
    ]);

    if (!summary) {
      throw new BadRequestError(t('tours.errors.filters.failed'));
    }

    return { data: summary };
  };
}
