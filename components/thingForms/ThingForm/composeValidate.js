import isAscii from 'validator/lib/isAscii';

import { locales } from '../../../appConfig';
import { isArray } from '../../../core/utils';

// вспомогательная формула чтобы выполнять рекурсивную валидаци по дереву ...
// ... значений используя дополнительный параметр - errors - ...
// ... словарь найденных ошибок
const validate = (thingConfig, values, errors = {}) => {
  const { i18nFields, orderOfTheFormFields, subDocumentFields } = thingConfig;
  // получаем все обязательные i18n поля разбитые по локалям
  // (как и есть в форме)
  const requiredI18nFields = i18nFields
    .map(({ name, required }) => required && name)
    .filter(Boolean);

  // получаем все остальные обязательные поля
  const requiredFields = orderOfTheFormFields
    .map(
      ({ name, kind, required }) =>
        kind !== 'subDocumentFields' && required && name,
    )
    .filter(Boolean);

  // проверка обязательных i18 полей
  requiredI18nFields.reduce((prev, field) => {
    locales.forEach(locale => {
      const value = values && values[field] && values[field][locale];
      if (!value || (isArray(value) && value.length === 0)) {
        if (!prev[field]) prev[field] = {}; // eslint-disable-line no-param-reassign
        prev[field][locale] = 'RequiredField'; // eslint-disable-line no-param-reassign
      }
    });
    return prev;
  }, errors);

  // проверка остальных обязательных полей
  requiredFields.reduce((prev, field) => {
    const value = values && values[field];
    if (
      value === '' ||
      value === undefined ||
      (isArray(value) && value.length === 0)
    ) {
      prev[field] = 'RequiredField'; // eslint-disable-line no-param-reassign
    }
    return prev;
  }, errors);

  // специальные проверки для специальных полей
  if (values && values.slug && !isAscii(values.slug)) {
    // eslint-disable-next-line no-param-reassign
    errors.slug = 'InvalidCharacters';
  }

  // рекурсивно переходим к обрабтке внедренных документов
  if (subDocumentFields.length) {
    subDocumentFields.forEach(({ name, array, attributes }) => {
      errors[name] = {}; // eslint-disable-line no-param-reassign
      if (array) {
        values[name].forEach((doc, i) => {
          errors[name][i] = {}; // eslint-disable-line no-param-reassign
          validate(attributes, doc, errors[name][i]);
          // eslint-disable-next-line no-param-reassign
          if (!Object.keys(errors[name][i]).length) delete errors[name][i];
        });
      } else {
        validate(attributes, values[name], errors[name]);
      }
      // удаляем словарь ошибок на текущем уровне иерархии
      // если он оказался пустым
      // eslint-disable-next-line no-param-reassign
      if (!Object.keys(errors[name]).length) delete errors[name];
    });
  }

  return errors;
};

const composeValidate = thingConfig => values => validate(thingConfig, values);

export default composeValidate;
