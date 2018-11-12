import gql from 'graphql-tag';

const paramNames = '[\\"section\\",\\"subject\\"]';
export default gql`
  query AllExcerptsPopulatedWithArticles {
    populatedExcerpts(thingName: "Article", paramNames: "${paramNames}") {
      _id
      subject
      section
      items {
        ... on ArticleType {
          _id
          slug
        }
      }
    }
  }
`;
