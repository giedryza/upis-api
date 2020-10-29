import { CompanyRecord, Payload } from 'domain/companies/companies.types';
import { Company } from 'domain/companies/companies.model';
import { Helpers } from 'utils/helpers';
import { List } from 'types/mongoose';
import { BadRequestError } from 'errors/bad-request.error';
import { QueryAggregation } from 'aggregations/query.aggregation';
import { fileStorage } from 'utils/file-storage';

export class Service {
  static getAll = async ({ query }: Payload.getAll) => {
    const pipeline = new QueryAggregation(query);

    const [{ meta, data }] = await Company.aggregate<List<CompanyRecord>>([
      pipeline.filter,
      pipeline.sort,
      pipeline.paginate,
    ]);

    return { data, meta };
  };

  static getOne = ({ document }: Payload.getOne) => {
    return { data: document };
  };

  static create = async ({ user, update }: Payload.create) => {
    const company = Company.construct({
      user,
      ...update,
    });

    await company.save();

    return { data: company };
  };

  static update = async ({ document, update }: Payload.update) => {
    const company = await Helpers.update(document, update);

    return { data: company };
  };

  static destroy = async ({ document }: Payload.destroy) => {
    const old = document.logo.key;

    await document.remove();

    if (old) {
      fileStorage.delete(old);
    }
  };

  static addLogo = async ({ document, file }: Payload.addLogo) => {
    if (!file) {
      throw new BadRequestError('File upload failed. Try again.');
    }

    const { location, key, contentType } = file;
    const old = document.logo.key;
    const update = { logo: { location, key, contentType } };

    const company = await Helpers.update(document, update);

    if (old) {
      fileStorage.delete(old);
    }

    return { data: company };
  };
}
