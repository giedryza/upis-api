import { Request } from 'express';
import { LeanDocument } from 'mongoose';

import {
  SocialLinkRecord,
  SocialLinkType,
} from 'domain/social-links/social-links.types';
import { SocialLink } from 'domain/social-links/social-links.model';
import { NotFoundError, BadRequestError } from 'errors';
import { Utils } from 'tools/utils';
import { QueryService } from 'tools/services';
import { PaginatedList } from 'types/common';

interface GetOne {
  id: string;
}

interface GetAll {
  query: Request['query'];
}

interface Create {
  body: {
    type: SocialLinkType;
    url: string;
    host: string;
  };
}

interface Update {
  id: string;
  body: {
    type: SocialLinkType | undefined;
    url: string | undefined;
  };
}

interface Destroy {
  id: string;
}

export class Service {
  static getAll = async ({
    query,
  }: GetAll): Promise<PaginatedList<SocialLinkRecord>> => {
    const { filter, sort, select, page, limit } = new QueryService(query);
    const options = {
      page,
      limit,
      sort,
      select,
      lean: true,
      leanWithId: false,
    };

    const { docs, totalDocs: total } = await SocialLink.paginate(
      filter,
      options
    );

    return { data: docs, meta: { total, page, limit } };
  };

  static getOne = async ({
    id,
  }: GetOne): Promise<{
    data: LeanDocument<SocialLinkRecord> | null;
  }> => {
    const socialLink = await SocialLink.findById(id).lean();

    if (!socialLink) {
      return { data: null };
    }

    return { data: socialLink };
  };

  static create = async ({
    body,
  }: Create): Promise<{ data: SocialLinkRecord }> => {
    const socialLink = new SocialLink(body);

    await socialLink.save();

    return { data: socialLink };
  };

  static update = async ({
    id,
    body,
  }: Update): Promise<{ data: LeanDocument<SocialLinkRecord> }> => {
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const filter = { _id: id };
    const update = Utils.stripUndefined(body);
    const options = { new: true };

    const socialLink = await SocialLink.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();

    if (!socialLink) {
      throw new BadRequestError('Failed to update the record.');
    }

    return { data: socialLink };
  };

  static destroy = async ({ id }: Destroy): Promise<void> => {
    if (!id) {
      throw new NotFoundError('Record not found.');
    }

    const socialLink = await SocialLink.findByIdAndDelete(id).lean();

    if (!socialLink) {
      throw new BadRequestError('Failed to update the record.');
    }
  };
}
