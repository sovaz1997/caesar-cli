const { program } = require('commander');


const ERROR_CODES = {
  BAD_ACTION: { code: 2, message: 'Invalid action!' },
};

const sendError = (errorType) => {
  console.error(ERROR_CODES[errorType].message);
  process.exit(ERROR_CODES[errorType].code);
};

const ENCODE = 'encode';
const DECODE = 'decode';

program
  .requiredOption('-s, --shift <value>', 'a shift')
  .option('-i, --input', ' an input file')
  .option('-o, --output', 'an output file')
  .requiredOption('-a, --action <value>', 'an action encode/decode')
  .parse(process.argv);

console.warn(program.opts());

if (program.action !== ENCODE || program.action !== DECODE) {
  sendError('BAD_ACTION');
}

// const encode = (program.action === ENCODE);
