import commitConfig from './commitlint.config';

const read = require('@commitlint/read');
const lint = require('@commitlint/lint');
const stdin = require('get-stdin');

async function commitLint() {
  const input = await stdin();

  const result = await lint(input, commitConfig);

  console.log(result);

  process.exit(1);
}

commitLint().then();

export default commitLint;
