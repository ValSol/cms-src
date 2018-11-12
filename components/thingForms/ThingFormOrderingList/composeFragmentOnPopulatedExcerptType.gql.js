import gql from 'graphql-tag';

// используем чтобы обновлять кеш
// функций возвращает запрос вида
/*
fragment myPopulatedExcerpt on PopulatedExcerptType {
  items {
    ... on ArticleType {
      _id
    }
  }
}
*/

const composeFragmentOnPopulatedExcerptType = ({
  thingName,
}) => gql`fragment populatedExcerpt on PopulatedExcerptType {
  items {
    ... on ${thingName}Type {
      _id
    }
  }
}`;

export default composeFragmentOnPopulatedExcerptType;
