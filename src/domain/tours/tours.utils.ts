import { TourDocument } from './tours.types';
import { SCORE_RATES } from './tours.constants';

export const calculateScore = (tour: TourDocument): number => {
  const values: Array<{ value: number; rate: number }> = [
    { value: Number(Boolean(tour.name)), rate: SCORE_RATES.name },
    { value: Number(Boolean(tour.description)), rate: SCORE_RATES.description },
    { value: Number(Boolean(tour.website)), rate: SCORE_RATES.website },
    { value: tour.departure.coordinates.length, rate: SCORE_RATES.departure },
    { value: tour.arrival.coordinates.length, rate: SCORE_RATES.arrival },
    { value: tour.rivers.length, rate: SCORE_RATES.rivers },
    { value: tour.regions.length, rate: SCORE_RATES.regions },
    { value: Number(Boolean(tour.distance)), rate: SCORE_RATES.distance },
    { value: Number(Boolean(tour.price)), rate: SCORE_RATES.price },
    { value: tour.amenities.length, rate: SCORE_RATES.amenities },
    { value: tour.photos.length, rate: SCORE_RATES.photos },
  ];

  return values.reduce((acc, cur) => cur.value * cur.rate + acc, 0);
};
