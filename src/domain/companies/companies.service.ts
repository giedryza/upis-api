import { CompanyDocument, Payload } from 'domain/companies/companies.types';
import { Company } from 'domain/companies/companies.model';
import { Helpers } from 'utils/helpers';
import { List } from 'types/mongoose';
import { BadRequestError } from 'errors/bad-request.error';
import { QueryAggregation } from 'aggregations/query.aggregation';

export class Service {
  static getAll = async ({ query }: Payload.getAll) => {
    const pipeline = new QueryAggregation(query);

    const [{ meta, data }] = await Company.aggregate<List<CompanyDocument>>([
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
    await document.remove();
  };

  static addLogo = async ({ document, logo }: Payload.addLogo) => {
    const update: Partial<CompanyDocument> = { logo };

    if (!logo) {
      throw new BadRequestError('Select company logo.');
    }

    const company = await Helpers.update(document, update);

    return { data: company };
  };
}
