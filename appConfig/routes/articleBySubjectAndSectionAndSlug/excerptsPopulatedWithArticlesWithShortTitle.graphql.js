import gql from 'graphql-tag';

export default gql`
  query Article($uk: Boolean!, $ru: Boolean!, $en: Boolean!) {
    populatedExcerpts(thingName: "Article") {
      _id
      subject
      section
      items {
        ... on ArticleType {
          _id
          slug
          shortTitle {
            uk @include(if: $uk)
            ru @include(if: $ru)
            en @include(if: $en)
          }
        }
      }
    }
  }
`;
