import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql/type';

import { composeFieldsForThingOrSubDocument, composeTypeName } from '../utils';

// кеш для хранения уже построинных типов
const subDocumentTypes = {};

const preComposeSubDocumentType = (
  attributes,
  input,
  consideringRequired,
  prevSubDocumentNames = [],
) => {
  // получаем имя текущего документа
  const { subDocumentFields, subDocumentName } = attributes;
  prevSubDocumentNames.push(subDocumentName);

  // формируем нужные поля
  const fields = composeFieldsForThingOrSubDocument(
    attributes,
    input,
    consideringRequired,
  );

  // все subDocument'ы должны содержать id - для использования ...
  // ... в массивах subDocument'ов
  fields.id = { type: new GraphQLNonNull(GraphQLString) };

  subDocumentFields.reduce(
    (prev, { name, array, attributes: attributes2, required }) => {
      const { subDocumentName: subDocumentName2 } = attributes2;
      // ошибка если дублируются SubDocumentNames в цепочке вызовов
      if (prevSubDocumentNames.inculdes(subDocumentName2)) {
        throw new TypeError(`Duplicate subDocumentName "${subDocumentName2}"!`);
      }
      const subDocumentType =
        subDocumentTypes[
          `${subDocumentName2}${composeTypeName(input, consideringRequired)[1]}`
        ] ||
        preComposeSubDocumentType(
          attributes2,
          input,
          consideringRequired,
          prevSubDocumentNames,
        );

      // если объявлен как массив - задаем массив
      const subDocumentType2 = array
        ? { type: new GraphQLList(subDocumentType) }
        : { type: subDocumentType };

      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type:
          consideringRequired && required
            ? new GraphQLNonNull(subDocumentType2)
            : subDocumentType2,
      };
      return prev;
    },
    fields,
  );

  const [descriptionSuffix, nameSuffix] = composeTypeName(
    input,
    consideringRequired,
  );
  const description = `${subDocumentName} SubDocument ${descriptionSuffix}`;
  const name = `${subDocumentName}${nameSuffix}`;

  const SubDocumentType = input
    ? new GraphQLInputObjectType({ fields, description, name })
    : new GraphQLObjectType({ fields, description, name });

  // помещаем созданный тип в кеш
  subDocumentTypes[name] = SubDocumentType;
  // и возвращает результат
  return SubDocumentType;
};

// экспортируем функцию которая берет тип из кеша или вычисляет этот кеш
const composeSubDocumentType = (attributes, input, consideringRequired) => {
  const { subDocumentName } = attributes;
  return (
    subDocumentTypes[
      `${subDocumentName}${composeTypeName(input, consideringRequired)[1]}`
    ] || preComposeSubDocumentType(attributes, input, consideringRequired)
  );
};

export default composeSubDocumentType;
