import { IOptions } from './prettier';
import { join } from 'path';

const defaultOptions: IOptions = {
  config: join(__dirname, 'prettier.config.js')
};

export default defaultOptions;
