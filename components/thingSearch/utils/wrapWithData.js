/* eslint-disable no-underscore-dangle */
import { graphql } from 'react-apollo';

import { locales } from '../../../appConfig';
// import graphqlArticleSearch from './articleSearch.graphql';
import composeSearch from './composeSearch.gql';

const wrapWithData = (thingConfig, { query: { q } }, Component) => {
  const searchQuery = composeSearch(thingConfig);
  const ComponentWithData = graphql(searchQuery, {
    options: ({ intl: { locale } }) => {
      // устанавливаем для какой локали загружатются данные
      // например { uk: true, ru: false, en: false }
      const variables = {
        query: q,
        locale,
      };
      locales.forEach(item => {
        variables[item] = item === locale;
      });
      return { variables };
    },
  })(Component);
  return ComponentWithData;
};

export default wrapWithData;
