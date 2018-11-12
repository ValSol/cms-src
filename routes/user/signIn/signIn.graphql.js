import gql from 'graphql-tag';

export default gql`
  mutation Signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      _id
      email
      role
    }
  }
`;
