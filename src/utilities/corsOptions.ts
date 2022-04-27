import { CorsOptions } from 'cors';
import { Request } from 'express';

type Callback = (err: Error | null, options: CorsOptions) => void;

const whitelistOrigins = ['http://localhost:3000'];

const corsOptions = (req: Request, callback: Callback) => {
  let options;
  if (whitelistOrigins.indexOf(req.header('Origin') as string) !== -1) {
    options = { origin: true, optionsSuccessStatus: 200 };
  } else {
    options = { origin: false };
  }
  callback(null, options);
};

export default corsOptions;
