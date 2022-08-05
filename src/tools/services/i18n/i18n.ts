import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { LanguageDetector } from 'i18next-http-middleware';

import { APP } from 'config';

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
    supportedLngs: APP.locales.supportedLanguages,
    fallbackLng: APP.locales.defaultLanguage,
  });

export default i18next;
