import { gql } from "graphql-request";

export const SIGNUP_MUTATION = gql`
mutation signUpMutation($email: String = "", $name: String = "", $password: String = "") {
  signUp(email: $email, name: $name, password: $password) {
    ... on Error {
      message
    }
    ... on MutationSignUpSuccess {
      __typename
      data {
        role
      }
    }
  }
}`;

export const LOGIN_MUTATION = gql`
mutation loginMutation($email: String = "", $password: String = "") {
  login(email: $email, password: $password) {
    ... on Error {
      message
    }
    ... on MutationLoginSuccess {
      __typename
      data {
        id 
        email
        name
        role
        token
        imageUrl
      }
    }
  }
}`;

export const ACCESS_TOKEN_MUTATION = gql`
mutation accessTokenMutation($refreshToken: String = "") {
  newAccessToken(refreshToken: $refreshToken) {
    ... on Error {
      message
    }
    ... on MutationNewAccessTokenSuccess {
      __typename
      data {
        accessToken
        role
        refreshToken
        name
        email
      }
    }
  }
}`;
