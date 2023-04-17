import { PipelineStage, UpdateAggregationStage } from 'mongoose';

import { SCORE_CAPS, SCORE_RATES } from './tours.constants';

export class Aggregation {
  static getFilters = (): PipelineStage[] => [
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
  ];

  static updateScores = (): UpdateAggregationStage[] => [
    {
      $set: {
        score: {
          $sum: [
            {
              $multiply: [
                {
                  $convert: {
                    input: {
                      $convert: {
                        input: { $strLenCP: '$name' },
                        to: 'bool',
                        onError: false,
                        onNull: false,
                      },
                    },
                    to: 'int',
                    onError: 0,
                    onNull: 0,
                  },
                },
                SCORE_RATES.name,
              ],
            },
            {
              $multiply: [
                {
                  $convert: {
                    input: {
                      $convert: {
                        input: { $strLenCP: '$description' },
                        to: 'bool',
                        onError: false,
                        onNull: false,
                      },
                    },
                    to: 'int',
                    onError: 0,
                    onNull: 0,
                  },
                },
                SCORE_RATES.description,
              ],
            },
            {
              $multiply: [
                {
                  $convert: {
                    input: {
                      $convert: {
                        input: { $strLenCP: '$website' },
                        to: 'bool',
                        onError: false,
                        onNull: false,
                      },
                    },
                    to: 'int',
                    onError: 0,
                    onNull: 0,
                  },
                },
                SCORE_RATES.website,
              ],
            },
            {
              $multiply: [
                {
                  $cond: {
                    if: { $isArray: '$departure.coordinates' },
                    then: { $size: '$departure.coordinates' },
                    else: 0,
                  },
                },
                SCORE_RATES.departure,
              ],
            },
            {
              $multiply: [
                {
                  $cond: {
                    if: { $isArray: '$arrival.coordinates' },
                    then: { $size: '$arrival.coordinates' },
                    else: 0,
                  },
                },
                SCORE_RATES.arrival,
              ],
            },
            {
              $multiply: [
                {
                  $min: [{ $size: '$rivers' }, SCORE_CAPS.rivers],
                },
                SCORE_RATES.rivers,
              ],
            },
            {
              $multiply: [
                {
                  $min: [{ $size: '$regions' }, SCORE_CAPS.regions],
                },
                SCORE_RATES.regions,
              ],
            },
            {
              $multiply: [
                {
                  $min: [{ $size: '$amenities' }, SCORE_CAPS.amenities],
                },
                SCORE_RATES.amenities,
              ],
            },
            {
              $multiply: [
                {
                  $cond: {
                    if: { $not: '$distance' },
                    then: 0,
                    else: 1,
                  },
                },
                SCORE_RATES.distance,
              ],
            },
            {
              $multiply: [
                {
                  $cond: {
                    if: { $not: '$price' },
                    then: 0,
                    else: 1,
                  },
                },
                SCORE_RATES.price,
              ],
            },
            {
              $multiply: [
                {
                  $size: '$photos',
                },
                SCORE_RATES.photos,
              ],
            },
          ],
        },
      },
    },
  ];
}
