import { CompanyDocument, Payload } from 'domain/companies/companies.types';
import { Company } from 'domain/companies/companies.model';
import { Document } from 'utils/document';
import { BadRequestError } from 'errors/bad-request.error';

export class Service {
  static getAll = async () => {
    const companies = await Company.find();

    const meta = {
      totalItems: companies.length,
    };

    return { data: companies, meta };
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
    const company = await Document.update(document, update);

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

    const company = await Document.update(document, update);

    return { data: company };
  };
}
