import gql from "graphql-tag";

const SHOW_USERS = gql`
    query users($skip: Int, $limit: Int) {
        users(skip: $skip, limit: $limit) {
            id
            email
            name
        }
    }
`;

const SHOW_USER = gql`
    query user($id: ID!) {
        user(id: $id) {
            id
            email
            name
        }
    }
`;

export default {
    SHOW_USERS,
    SHOW_USER
}