import gql from 'graphql-tag';

export default gql`
  query UserValidate($email: String!) {
    user(email: $email) {
      email
    }
  }
`;
