const { program } = require('commander');


const ERROR_CODES = {
  FEW_ARGUMENTS: 1,
};

program
  .option('-s', '--shift', 'a shift')
  .option('-i', '--input', ' an input file')
  .option('-o', '--output', 'an output file')
  .option('-a', '--action', 'an action encode/decode');


program.parse(process.argv);

if (!program.shift || !program.action) {
  console.error('Not all necessary arguments are specified!');
  process.exit(ERROR_CODES.FEW_ARGUMENTS);
}

