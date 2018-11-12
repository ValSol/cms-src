import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql/type';
import { GraphQLDateTime } from 'graphql-iso-date';

import { getThingConfig } from '../../appConfig';
import BackLinkType from './BackLinkType';
import composeSubDocumentType from './composeSubDocumentType';
import { composeFieldsForThingOrSubDocument, composeTypeName } from '../utils';

const thingTypes = {};

const composeThingType = (thingName, input, consideringRequired) => {
  // получаем конфигурацию исходя из которой и задается тип
  const thingConfig = getThingConfig(thingName);

  const { subDocumentFields } = thingConfig;

  // задаем сначала те поля которые обязательно присутствуют в любом типе thing
  const fields = {
    _id: { type: GraphQLID },
    createdAt: {
      type: consideringRequired
        ? new GraphQLNonNull(GraphQLDateTime)
        : GraphQLDateTime,
    },
    updatedAt: {
      type: consideringRequired
        ? new GraphQLNonNull(GraphQLDateTime)
        : GraphQLDateTime,
    },
    score: { type: GraphQLFloat },
    ...composeFieldsForThingOrSubDocument(
      thingConfig,
      input,
      consideringRequired,
    ),
  };

  // задаем поля которые обязательно присутствуют в возвращаемых полях
  if (!input) {
    fields.backLinks = {
      type: new GraphQLNonNull(new GraphQLList(BackLinkType)),
    };
  }

  // добавляем subDocumentField поля
  subDocumentFields.reduce((prev, { name, array, attributes, required }) => {
    const subDocumentType = composeSubDocumentType(
      attributes,
      input,
      consideringRequired,
    );

    // если объявлен как массив - задаем массив
    const subDocumentType2 = array
      ? new GraphQLList(subDocumentType)
      : subDocumentType;

    // eslint-disable-next-line no-param-reassign
    prev[name] = {
      type:
        consideringRequired && required
          ? new GraphQLNonNull(subDocumentType2)
          : subDocumentType2,
    };
    return prev;
  }, fields);

  const [descriptionSuffix, nameSuffix] = composeTypeName(
    input,
    consideringRequired,
  );
  const description = `${thingName} Thing ${descriptionSuffix}`;
  const name = `${thingName}${nameSuffix}`;

  const ThingType = input
    ? new GraphQLInputObjectType({ fields, description, name })
    : new GraphQLObjectType({ fields, description, name });

  // помещаем созданный тип в кеш
  thingTypes[name] = ThingType;
  // и возвращает результат
  return ThingType;
};

// экспортируем функцию которая берет тип из кеша или вычисялет его
export default (thingName, input, consideringRequired) =>
  thingTypes[`${thingName}${composeTypeName(input, consideringRequired)[1]}`] ||
  composeThingType(thingName, input, consideringRequired);
