import {  } from '@walrus/shared-utils';

const eslint = require('eslint');

interface IOptions {
  cwd?: string;
}

class Linter {
  private eslint: any;

  constructor(options: IOptions) {
    this.eslint = eslint;
  }
}
