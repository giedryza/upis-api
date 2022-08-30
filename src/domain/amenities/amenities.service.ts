import { BadRequestError } from 'errors';
import { Currency } from 'types/common';
import { Company } from 'domain/companies/companies.model';

import { Variant, Unit, AmenityRecord } from './amenities.types';
import { Amenity } from './amenities.model';

interface GetOne {
  id: string;
}

interface Create {
  variant: Variant;
  amount: number;
  currency: Currency;
  unit: Unit;
  info: string;
  companyId: string;
}

interface Update {
  id: string;
  variant: Variant;
  unit: Unit;
  info: string;
  amount: number;
  currency: Currency;
}

interface Destroy {
  id: string;
}

export class Service {
  static getOne = async ({
    id,
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
    companyId,
    variant,
    unit,
    info,
    amount,
    currency,
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
      throw new BadRequestError('Company does not exist.');
    }

    return {
      data: amenity,
    };
  };

  static update = async ({
    id,
    variant,
    unit,
    info,
    amount,
    currency,
  }: Update): Promise<{ data: AmenityRecord }> => {
    const amenity = await Amenity.findByIdAndUpdate(
      id,
      {
        variant,
        unit,
        info,
        price: {
          amount,
          currency,
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!amenity) {
      throw new BadRequestError('Amenity does not exist.');
    }

    return {
      data: amenity,
    };
  };

  static destroy = async ({ id }: Destroy): Promise<void> => {
    const amenity = await Amenity.findByIdAndDelete(id).lean();

    if (!amenity) {
      throw new BadRequestError('Amenity does not exist.');
    }
  };
}
