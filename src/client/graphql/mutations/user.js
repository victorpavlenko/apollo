import gql from 'graphql-tag';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
          id
          name
          email
      }
  }
`;
const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $input: UpdateUserInput!) {
      updateUser(id: $id, input: $input) {
          id
          name
          email
      }
  }
`;
const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
      deleteUser(id: $id) {
          id
      }
  }
`;

export default {
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER
}