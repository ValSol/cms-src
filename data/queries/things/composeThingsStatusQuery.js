import { GraphQLObjectType, GraphQLInt } from 'graphql/type';
import { plural } from 'pluralize';

import { getThingConfig, locales } from '../../../appConfig';
import rbac from '../../../core/rbac';
import { resolveThingsStatus } from '../../utils';

const composeThingsStatusQuery = thingName => {
  const thingConfig = getThingConfig(thingName);

  // аргументов у запроса нет
  const queryArgs = {};

  const thingsStatus = {
    type: new GraphQLObjectType({
      name: `${plural(thingName.toLowerCase())}Status`,
      fields: {
        excerptErrors: { type: GraphQLInt },
        textIndexErrors: { type: GraphQLInt },
        backLinksErrors: { type: GraphQLInt },
      },
    }),
    description: `${thingName} DB Status`,
    args: queryArgs,
    async resolve(parentValue) {
      const { request: { user } } = parentValue;

      // если у пользователя нет прав на оценку статуса БД - выходим
      if (!rbac.can(`${thingName}:status`, { user })) return null;

      const { textIndexes, excerpts, backLinks } = await resolveThingsStatus(
        thingConfig,
      );
      let textIndexErrors = 0;
      locales.forEach(locale => {
        textIndexErrors += textIndexes[locale].insert.length;
        textIndexErrors += textIndexes[locale].update.length;
        textIndexErrors += textIndexes[locale].remove.length;
      });
      const excerptErrors =
        excerpts.insert.length +
        excerpts.update.length +
        excerpts.remove.length;

      const backLinksErrors = backLinks
        ? Object.keys(backLinks).reduce((prev, key) => {
            backLinks[key].forEach(() => {
              // eslint-disable-next-line no-param-reassign
              prev += 1;
            });
            return prev;
          }, 0)
        : 0;
      return { excerptErrors, textIndexErrors, backLinksErrors };
    },
  };
  return thingsStatus;
};

export default composeThingsStatusQuery;
