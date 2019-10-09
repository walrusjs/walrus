import { IConfig } from '@walrus/types';

// 默认配置
export const defaults = (): IConfig => ({
  frame: 'react',
  useTypescript: true,
  plugins: []
});
