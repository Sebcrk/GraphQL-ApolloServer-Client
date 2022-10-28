import { useQuery } from "@apollo/client";
import { ALL_PERSONS } from "./graphql-queries";
import { useMutation } from "@apollo/client";
import {
  CREATE_PERSON,
  EDIT_NUMBER,
  ADD_AS_FRIEND,
  LOGIN,
} from "./graphql-mutations";

export const usePersons = () => {
  const result = useQuery(ALL_PERSONS);
  return result;
};

/**
 * It's a hook that returns a function that creates a person
 * @param notifyError - This is a function that will be called when the mutation fails.
 * @returns An object with a single property, createPerson, which is a function.
 */

export const useAddPerson = (notifyError) => {
  const [createPerson] = useMutation(CREATE_PERSON, {
    // /* It's making a new HTTP request to the server to get the updated data. */
    refetchQueries: [{ query: ALL_PERSONS }],


   /* It's updating the cache manually. This avoids another HTTP request (refetch)*/
    update: (store, response) => {
      const query = ALL_PERSONS
      const dataInStore = store.readQuery({ query});
      store.writeQuery({
        query,
        data: {
          ...dataInStore,
          allPersons: [...dataInStore.allPersons, response.data.addPerson],
        },
      });
    },
    onError: (error) => {
      notifyError(error.graphQLErrors[0].message);
    },
  });

  return { createPerson };
};

/**
 * It's a function that returns an object with a function called editNumber.
 * @returns The editNumber function.
 */
export const useEditNumber = () => {
  const [editNumber, result] = useMutation(EDIT_NUMBER);

  return { editNumber, result };
};

export const useLogin = (notifyError) => {
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      notifyError(error.graphQLErrors[0].message);
    },
  });

  return { login, result };
};

export const useAddFriend = (notifyError) => {
  const [addAsFriend, result] = useMutation(ADD_AS_FRIEND, {
    onError: (error) => {
      notifyError(error.graphQLErrors[0].message);
    },
  });

  return { addAsFriend, result };
};
