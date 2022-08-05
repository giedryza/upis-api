import path from 'path';
import { I18n, ConfigurationOptions } from 'i18n';

export const i18n = {} as typeof i18node;

const options: ConfigurationOptions = {
  locales: ['en', 'lt'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '..', '..', '..', 'translations'),
  objectNotation: true,
  updateFiles: false,
  register: i18n,
};

export const i18node = new I18n(options);
