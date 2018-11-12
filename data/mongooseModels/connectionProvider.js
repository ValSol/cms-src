/* eslint-disable no-console */
import Promise from 'bluebird';
import mongoose from 'mongoose';

mongoose.Promise = Promise;
// eslint-disable-next-line no-underscore-dangle
const _internalConnectionPool = {};
// !!! в продакшене нужно установить:
// { poolSize: 5, promiseLibrary: Promise, autoIndex: false }
// !!! http://mongoosejs.com/docs/guide.html
const connectionProvider = (url, database, options) => {
  const opts = Object.assign(
    {},
    { poolSize: 5, promiseLibrary: Promise },
    options,
  );

  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    const address = `mongodb://${url}/${database}`;
    if (_internalConnectionPool[address]) {
      return resolve(_internalConnectionPool[address]);
    }
    try {
      const conn = mongoose.createConnection(address, opts);
      conn.on('open', () => {
        _internalConnectionPool[address] = conn;
        return resolve(_internalConnectionPool[address]);
      });
      conn.on('error', err => {
        console.error('MongoDB error: %s', err);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export default connectionProvider;
