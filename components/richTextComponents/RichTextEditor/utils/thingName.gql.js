import gql from 'graphql-tag';

export default gql`
  query thingName($_id: ID!) {
    thingName(_id: $_id)
  }
`;
