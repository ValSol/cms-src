import isMongoId from 'validator/lib/isMongoId';

import * as appConfig from '../../appConfig';
import { getEntitiesDataFromFields, unpackFields } from '../../core/utils';

const entityType = 'LINK';
const { thingNames } = appConfig;

const dataCheck = {
  _id: arg => arg && isMongoId(arg),
  thingName: arg => arg && thingNames.includes(arg),
};

// вспомогательная утилита собирающая по всей иерархии из richText полей ...
// ... данные по LINK entities ссылающихся на thing объекты ...
// ... т.е. те LINK entities у которых в data определены атрибуты _id и thingName

const getLinksFromFields = (fields, thingConfig) =>
  getEntitiesDataFromFields(
    // richText поля из JSON строки преобразуются в draft.js объект
    unpackFields(fields, thingConfig),
    entityType,
    dataCheck,
    thingConfig,
    appConfig,
  );

export default getLinksFromFields;
