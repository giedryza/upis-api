import { TourRecord } from './tours.types';

export const MAX_PHOTOS = 5;

export const SCORE_RATES = {
  name: 1,
  description: 1,
  website: 1,
  departure: 3,
  arrival: 0.5,
  rivers: 0.25,
  regions: 0.5,
  distance: 1,
  price: 1,
  amenities: 0.5,
  photos: 1,
} satisfies Partial<Record<keyof TourRecord, number>>;

export const SCORE_CAPS = {
  rivers: 3,
  regions: 2,
  amenities: 10,
} satisfies Partial<Record<keyof TourRecord, number>>;
