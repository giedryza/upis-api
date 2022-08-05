import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { LanguageDetector } from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(
        __dirname,
        '..',
        '..',
        '..',
        'translations',
        '{{lng}}.json'
      ),
    },
    detection: {
      order: ['header'],
    },
    supportedLngs: ['en', 'lt'],
    fallbackLng: 'en',
  });

export default i18next;
