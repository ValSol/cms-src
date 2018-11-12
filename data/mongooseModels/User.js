import Promise from 'bluebird';
import mongoose from 'mongoose';

import { allRoles } from '../../core/rbac/roles';
import connectionProvider from './connectionProvider';
import { serverSettings } from '../../config';

const bcrypt = Promise.promisifyAll(require('bcrypt'));

const { Schema } = mongoose;

const UserSchema = new Schema({
  /*  name: {
    type: String,
    required: true,
  }, */
  email: {
    type: String,
    trim: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: allRoles,
    required: true,
  },
});

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hash = await bcrypt.hashAsync(this.password, 12);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
  return null; // добавил чтобы не ругался eslint
});

UserSchema.methods.passwordIsValid = function passwordIsValid(password) {
  try {
    return bcrypt.compareAsync(password, this.password);
  } catch (err) {
    throw err;
  }
};

// по умолчанию экспортируем функцию getUserModel
export default async () => {
  // в дальнейшем здесь можно было бы сделать проверку process.env переменной
  // и в завивсимости от значений определенных переменных окружения использовать
  // различные serverSettings и, следовательно, подключать разные БД,
  // например, для случая тестирования
  const { serverUrl, database } = serverSettings;

  try {
    const conn = await connectionProvider(serverUrl, database);
    return conn.model('User', UserSchema);
  } catch (err) {
    throw err;
  }
};
