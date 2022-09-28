import { TFunction } from 'i18next';

import { BadRequestError } from 'errors';
import { Currency } from 'types/common';
import { Company } from 'domain/companies/companies.model';

import { Variant, Unit, AmenityRecord } from './amenities.types';
import { Amenity } from './amenities.model';

interface GetOne {
  data: {
    id: string;
  };
}

interface Create {
  data: {
    variant: Variant;
    amount: number;
    currency: Currency;
    unit: Unit;
    info: string;
    companyId: string;
  };
  t: TFunction;
}

interface Update {
  data: {
    id: string;
    variant: Variant;
    unit: Unit;
    info: string;
    amount: number;
    currency: Currency;
  };
  t: TFunction;
}

interface Destroy {
  data: {
    id: string;
  };
  t: TFunction;
}

export class Service {
  static getOne = async ({
    data: { id },
  }: GetOne): Promise<{ data: AmenityRecord | null }> => {
    const amenity = await Amenity.findById(id).lean();

    if (!amenity) {
      return { data: null };
    }

    return {
      data: amenity,
    };
  };

  static create = async ({
    data: { companyId, variant, unit, info, amount, currency },
    t,
  }: Create): Promise<{ data: AmenityRecord }> => {
    const amenity = new Amenity({
      variant,
      unit,
      info,
      price: amount ? { amount, currency } : null,
    });

    const { _id } = await amenity.save();

    const company = await Company.findOneAndUpdate(
      { _id: companyId },
      {
        $push: {
          amenities: _id,
        },
      }
    ).lean();

    if (!company) {
      throw new BadRequestError(t('amenities.errors.companyId.invalid'));
    }

    return {
      data: amenity,
    };
  };

  static update = async ({
    data: { id, variant, unit, info, amount, currency },
    t,
  }: Update): Promise<{ data: AmenityRecord }> => {
    const amenity = await Amenity.findByIdAndUpdate(
      id,
      {
        variant,
        unit,
        info,
        price: amount ? { amount, currency } : null,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!amenity) {
      throw new BadRequestError(t('amenities.errors.id.invalid'));
    }

    return {
      data: amenity,
    };
  };

  static destroy = async ({ data: { id }, t }: Destroy): Promise<void> => {
    const amenity = await Amenity.findByIdAndDelete(id).lean();

    if (!amenity) {
      throw new BadRequestError(t('amenities.errors.id.invalid'));
    }
  };
}
