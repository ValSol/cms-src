import getEntitiesData from '../../draft/getEntitiesData';

// функция возвращает перечень данных из entities опредленного типа, ...
// ... взятых из "исходного (сырого) контента" и удовлетворяющих функциям dataCheck
// entityMap - словарь entities из исходного (сырого) контента
// entityType - тип entities из которых отбираем данные
// dataCheck - словарь методов проверяющий правильность атрибутов

// вспомогательная функция создает ключ к объекту однозначно
// определяющий этот ключ
const keyForObject = (obj, keys) =>
  keys
    .reduce((prev, key) => {
      prev.push(obj[key]);
      return prev;
    }, [])
    .join(':');

// рекурсивная вспомогательная функция делающая всю основную работу ...
// собриающая данные из entities в richText полях и складывающая в словарь dict
const putEntitiesDataToDict = (
  fields,
  entityType,
  dataCheck,
  thingConfig,
  locales,
  keys,
  dict = {},
) => {
  const { richTextFields, subDocumentFields } = thingConfig;

  richTextFields.reduce((prev, fieldName) => {
    if (fields[fieldName]) {
      // если richText поле присутствует ...
      locales.forEach(locale => {
        // ... перебираем значения во всех локалях
        if (fields[fieldName][locale]) {
          const rowContent = fields[fieldName][locale];
          // получаем массив entities
          const dataList = getEntitiesData(rowContent, entityType, dataCheck);
          dataList.forEach(data => {
            const key = keyForObject(data, keys);
            // eslint-disable-next-line no-param-reassign
            prev[key] = data;
          });
        }
      });
    }
    return prev;
  }, dict);
  subDocumentFields.forEach(({ name, array, attributes }) => {
    // если имеются заполненные subDocuments то из имеющиеся в ник richText ...
    // ... полей извлекаем data entities
    if (fields[name]) {
      if (array) {
        // если массив subDocuments
        fields[name].forEach(item => {
          putEntitiesDataToDict(
            item,
            entityType,
            dataCheck,
            attributes,
            locales,
            keys,
            dict,
          );
        });
      } else {
        // если отдельный subDocument
        putEntitiesDataToDict(
          fields[name],
          entityType,
          dataCheck,
          attributes,
          locales,
          keys,
          dict,
        );
      }
    }
  });
  return dict;
};

const getEntitiesDataFromFields = (
  fields,
  entityType,
  dataCheck,
  thingConfig,
  appConfig,
) => {
  const { locales } = appConfig;
  // массив ключей используемых в data например: ['_id', 'thingName']
  const keys = Object.keys(dataCheck);
  const dict = putEntitiesDataToDict(
    fields,
    entityType,
    dataCheck,
    thingConfig,
    locales,
    keys,
  );
  return Object.keys(dict).map(key => dict[key]);
};

export default getEntitiesDataFromFields;
