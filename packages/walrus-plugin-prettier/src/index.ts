#!/usr/bin/env node

import { IApi } from '@walrus/types';

export default function(api: IApi) {
  api.registerCommand('prettier', {
    description: 'prettier source files',
    usage: 'walrus prettier [opts] [filename ...]',
    options: {
      '--print-width <int>': 'print width (default: 100)'
    },
    details: 'For more options, see https://prettier.io/docs/en/options.html'
  }, (args, opts) => {
    console.log(opts);
  })
}
