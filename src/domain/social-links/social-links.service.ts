import { Request } from 'express';
import { LeanDocument } from 'mongoose';
import { TFunction } from 'i18next';

import {
  SocialLinkRecord,
  SocialLinkType,
} from 'domain/social-links/social-links.types';
import { SocialLink } from 'domain/social-links/social-links.model';
import { BadRequestError } from 'errors';
import { QueryService } from 'tools/services';
import { PaginatedList } from 'types/common';

interface GetAll {
  query: Request['query'];
}

interface GetOne {
  data: {
    id: string;
  };
}

interface Create {
  data: {
    type: SocialLinkType;
    url: string;
    host: string;
  };
  t: TFunction;
}

interface Update {
  data: {
    id: string;
    type: SocialLinkType | undefined;
    url: string | undefined;
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
    data: { id },
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
    data,
    t,
  }: Create): Promise<{ data: SocialLinkRecord }> => {
    const socialLink = new SocialLink(data);

    if (!socialLink) {
      throw new BadRequestError(t('socialLinks.errors.id.create'));
    }

    await socialLink.save();

    return { data: socialLink };
  };

  static update = async ({
    data,
    t,
  }: Update): Promise<{ data: LeanDocument<SocialLinkRecord> }> => {
    const { id, ...update } = data;

    const filter = { _id: id };
    const options = { new: true };

    const socialLink = await SocialLink.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();

    if (!socialLink) {
      throw new BadRequestError(t('socialLinks.errors.id.update'));
    }

    return { data: socialLink };
  };

  static destroy = async ({ data: { id }, t }: Destroy): Promise<void> => {
    const socialLink = await SocialLink.findByIdAndDelete(id).lean();

    if (!socialLink) {
      throw new BadRequestError(t('socialLinks.errors.id.destroy'));
    }
  };
}
