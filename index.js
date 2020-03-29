const { program } = require('commander');
const fs = require('fs');
const through2 = require('through2');

const ALG_LEN = 26;

const isUpperCase = (letter) => {
  return letter[0] >= 'A' && letter[0] <= 'Z';
};

const isLowerCase = (letter) => {
  return letter[0] >= 'a' && letter[0] <= 'z';
};

const symCode = (letter) => {
  if (isLowerCase(letter)) {
    return letter.charCodeAt(0) - 'a'.charCodeAt(0);
  }

  if (isUpperCase(letter)) {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0);
  }

  return;
};

const translate = (code, shift) => {
  code += shift;

  if (code < 0) {
    code += ALG_LEN;
  }

  code %= ALG_LEN;

  return code;
};

const encodeLetter = (letter, shift) => {
  letter = String.fromCharCode(letter);
  const code = symCode(letter);
  const newCode = translate(code, shift);

  if (newCode !== undefined) {
    if (isLowerCase(letter)) {
      return String.fromCharCode('a'.charCodeAt(0) + newCode);
    }

    if (isUpperCase(letter)) {
      return String.fromCharCode('A'.charCodeAt(0) + newCode);
    }
  }

  return letter;
};

const CaesarsCode = (chunk, shift, encode) => {
  shift = Number(shift);
  if (!encode) {
    shift = -shift;
  }

  let newStr = '';

  for (let i = 0; i < chunk.length; ++i) {
    newStr += encodeLetter(chunk[i], shift);
  }

  return newStr;
};

const ERROR_CODES = {
  BAD_ACTION: { code: 1, message: 'Invalid action!' },
  BAD_INPUT: { code: 2, message: 'Invalid input!' },
  BAD_OUTPUT: { code: 3, message: 'Invalid output!' },
};

const sendError = (errorType) => {
  console.error(ERROR_CODES[errorType].message);
  process.exit(ERROR_CODES[errorType].code);
};

const ENCODE = 'encode';
const DECODE = 'decode';

program
  .requiredOption('-s, --shift <value>', 'a shift')
  .option('-i, --input <path>', ' an input file')
  .option('-o, --output <path>', 'an output file')
  .requiredOption('-a, --action <value>', 'an action encode/decode')
  .parse(process.argv);

if (program.action !== ENCODE && program.action !== DECODE) {
  sendError('BAD_ACTION');
}

let inputStream;

if (program.input) {
  inputStream = fs
    .createReadStream(program.input)
    .on('error', () => sendError('BAD_INPUT'));
} else {
  inputStream = process.stdin;
}

let outputStream;

if (program.output) {
  outputStream = fs
    .createWriteStream(program.output)
    .on('error', () => sendError('BAD_OUTPUT'));
} else {
  outputStream = process.stdout;
}

const encode = program.action === ENCODE;

inputStream
  .pipe(
    through2(function f(chunk, enc, callback) {
      this.push(CaesarsCode(chunk, program.shift, encode));
      callback();
    })
  )
  .pipe(outputStream)
  .on('finish', () => console.warn('Success!'));
