module.exports = {
  encode: (str) => Buffer.from(str, 'ascii').toString('base64'),
  decode: (str) => Buffer.from(str, 'base64').toString('ascii'),
};
