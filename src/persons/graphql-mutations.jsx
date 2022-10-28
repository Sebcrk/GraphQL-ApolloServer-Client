import { gql } from "@apollo/client";


/* A mutation that is used to create a person. */
export const CREATE_PERSON = gql`
  mutation AddPerson($name: String!, $street: String!, $city: String!) {
    addPerson(name: $name, street: $street, city: $city) {
      id
      name
      address {
        city
        street
      }
    }
  }
`;

/* A mutation that is used to edit the phone number of a person. */
export const EDIT_NUMBER = gql`
mutation EditPhone($name: String!, $phone: String!) {
  editNumber(name: $name, phone: $phone) {
    name
    phone
    id
  }
}
`

export const CREATE_USER = gql`
mutation CreateUser($username: String!) {
  createUser(username: $username) {
    id
    username
    friends {
      name
    }
  }
}
`

export const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

export const ADD_AS_FRIEND = gql`
mutation AddAsFriend($name: String!) {
  addAsFriend(name: $name) {
    id
    username
  friends {
    id
    name
    phone
  }
  }
}
`