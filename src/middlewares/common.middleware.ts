import { json, Express } from 'express';
import cors from 'cors';

class CommonMiddleware {
  constructor(private app: Express) {}

  useJson = () => {
    this.app.use(json());
  };

  useCors = () => {
    this.app.use(cors());
  };
}

export { CommonMiddleware };
