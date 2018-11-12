import gql from 'graphql-tag';

export default gql`
  query Article(
    $subject: String!
    $section: String!
    $slug: String!
    $uk: Boolean!
    $ru: Boolean!
    $en: Boolean!
  ) {
    article(subject: $subject, section: $section, slug: $slug) {
      title {
        uk @include(if: $uk)
        ru @include(if: $ru)
        en @include(if: $en)
      }
      content {
        uk @include(if: $uk)
        ru @include(if: $ru)
        en @include(if: $en)
      }
      _id
    }
  }
`;
