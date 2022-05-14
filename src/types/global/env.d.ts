import { environment } from 'core/environment';

export type NodeEnv = 'production' | 'development';

type Env = typeof environment.variables[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<Env, string> {}
  }
}
