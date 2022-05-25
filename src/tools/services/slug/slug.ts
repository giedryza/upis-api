import slugify from 'slugify';

export class SlugService {
  static get = (name: string): Promise<string> =>
    new Promise((resolve) => {
      const slug = slugify(name, {
        replacement: '-',
        lower: true,
        strict: true,
        trim: true,
      });

      if (!slug) {
        resolve('');
      }

      resolve(slug);
    });
}
