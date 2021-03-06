import { gql } from "apollo-boost";

export const LOG_IN = gql`
    mutation requestSecret($email: String!) {
        requestSecret(email: $email)
    }
`;

export const CREATE_ACCOUNT = gql`
    mutation createAccount(
        $userName: String!
        $email: String!
        $firstName: String!
        $lastName: String!
    ) {
        createAccount(
            userName: $userName,
            email: $email,
            firstName: $firstName,
            lastName: $lastName
        )
    }
`;

export const CONFIRM_SECRET = gql`
    mutation confrimSecret($secret: String!, $email: String!) {
        confirmSecret(secret: $secret, email: $email)
    }
`;