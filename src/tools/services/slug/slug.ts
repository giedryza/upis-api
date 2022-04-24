import slugify from 'slugify';

export class SlugService {
  static get = (name: string): Promise<string | null> =>
    new Promise((resolve) => {
      const options = {
        lower: true,
        strict: true,
      };

      const slug = slugify(name, options);

      if (!slug) {
        resolve(null);
      }

      resolve(slug);
    });
}
