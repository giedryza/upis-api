import path from 'path';
import { I18n } from 'i18n';

export const t = {} as T;

export const i18n = new I18n({
  locales: ['en', 'lt'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '..', '..', '..', 'translations'),
  objectNotation: true,
  updateFiles: false,
  register: t,
});

interface T {
  __: typeof i18n.__;
}
