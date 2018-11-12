import getLinksFromFields from './getLinksFromFields';

// вспомогательная функция получает исходные и текущие значения полей
// и вычисляет в какие thing-объектах нужно добавить / удалить ссылки
// на входе:
// initialFields - исходные значения полей
// fields - текущие значения полей
// thingConfig - конфигурация обрабатываемой thing
// на выходе объект: { linksToAdd, linksToRemove }

const getLinksForAddAndRemove = (initialFields, fields, thingConfig) => {
  // используем начальные значения только ИЗМЕНЕННЫХ полей ...
  // ... которые являются либо richTextFields либо subDocumentFields
  const { richTextFields, subDocumentFields } = thingConfig;
  const subDocumentFieldNames = subDocumentFields.map(({ name }) => name);
  const initialFields2 = Object.keys(fields).reduce((prev, key) => {
    if (!richTextFields.includes(key) && !subDocumentFieldNames.includes(key)) {
      return prev;
    }
    if (initialFields[key] === undefined) {
      throw new TypeError(`No initial value for key: "${key}"!`);
    }
    // eslint-disable-next-line no-param-reassign
    prev[key] = initialFields[key];
    return prev;
  }, {});
  const initialLinksDict = getLinksFromFields(
    initialFields2,
    thingConfig,
    // eslint-disable-next-line no-underscore-dangle
  ).reduce((prev, item) => ({ ...prev, [item._id]: item }), {});

  const linksDict = getLinksFromFields(fields, thingConfig).reduce(
    // eslint-disable-next-line no-underscore-dangle
    (prev, item) => ({ ...prev, [item._id]: item }),
    {},
  );

  Object.keys(initialLinksDict).forEach(key => {
    if (linksDict[key]) {
      delete initialLinksDict[key];
      delete linksDict[key];
    }
  });

  const linksToRemove = Object.keys(initialLinksDict).map(
    key => initialLinksDict[key],
  );
  const linksToAdd = Object.keys(linksDict).map(key => linksDict[key]);

  return { linksToRemove, linksToAdd };
};

export default getLinksForAddAndRemove;
