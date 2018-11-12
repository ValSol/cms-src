import gql from 'graphql-tag';

export default gql`
  query ArticlesSideNavigation($uk: Boolean!, $ru: Boolean!, $en: Boolean!) {
    populatedExcerpts(thingName: "Article") {
      _id
      subject
      section
      items {
        ... on ArticleType {
          _id
          slug
          section
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
