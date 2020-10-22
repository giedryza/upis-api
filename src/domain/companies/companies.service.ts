import { Payload } from 'domain/companies/companies.types';
import { Company } from 'domain/companies/companies.model';
import { Helpers } from 'utils/helpers';
import { NotFoundError } from 'errors/not-found.error';

export class Service {
  static getAll = async () => {
    const companies = await Company.find();

    const meta = {
      totalItems: companies.length,
    };

    return { data: companies, meta };
  };

  static getOne = async ({ id }: Payload.getOne) => {
    const company = await Company.findOne({ _id: id });

    if (!company) {
      throw new NotFoundError('Company not found.');
    }

    return { data: company };
  };

  static create = async ({
    user,
    name,
    phone,
    email,
    description,
  }: Payload.create) => {
    const company = Company.construct({
      user,
      name,
      phone,
      email,
      description,
    });

    await company.save();

    return { data: company };
  };

  static update = async ({
    id,
    name,
    phone,
    email,
    website,
    social,
    location,
    description,
    address,
  }: Payload.update) => {
    const filter = { _id: id };
    const update = Helpers.stripUndefined({
      name,
      phone,
      email,
      description,
      website,
      social,
      address,
      location,
    });

    const company = await Company.findOneAndUpdate(filter, update, {
      new: true,
    });

    return { data: company };
  };

  static destroy = async ({ id }: Payload.destroy) => {
    const company = await Company.findOneAndDelete({ _id: id });

    return company;
  };

  static logo = async ({ id, location }: Payload.logo) => {
    const filter = { _id: id };
    const update = { logo: location };

    const company = await Company.findOneAndUpdate(filter, update, {
      new: true,
    });

    return { data: company };
  };
}
