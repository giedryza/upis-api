import { BaseProvider, CloudinaryProvider, S3Provider } from './providers';

type Provider = 's3' | 'cloudinary';

const SERVICE_BY_PROVIDER: Record<Provider, BaseProvider> = {
  cloudinary: new CloudinaryProvider(),
  s3: new S3Provider(),
};

export const filesService = (provider: Provider) =>
  SERVICE_BY_PROVIDER[provider];
