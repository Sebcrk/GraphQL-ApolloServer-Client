import { gql } from "@apollo/client";

export const ALL_PERSONS = gql`
  query FindAllPersons{
    allPersons {
      id
      name
      address {
        street
        city
      }
    }
  }
`;

export const FIND_PERSON = gql`
  query FindPersonByName($name: String!) {
    findPerson(name: $name) {
      id
      name
      phone
      address {
        street
        city
      }
    }
  }
`;

export const ALL_USERS = gql`
query AllUsers {
  allUsers {
  id
  username
  friends {
    name
  }  
  }
}
`

export const ME = gql`
query Me {
  me {
    id
    username
    friends {
      id
      name
    }
  }
}
`