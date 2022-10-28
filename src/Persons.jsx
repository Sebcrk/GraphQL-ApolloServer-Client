import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { FIND_PERSON } from "./persons/graphql-queries";


const Persons = (props) => {
  const { persons } = props;
  const [person, setPerson] = useState(null);
  const [getPerson, result] = useLazyQuery(FIND_PERSON);
  
    useEffect(() => {
      if (result.data) {
        setPerson(result.data.findPerson);
      }
    }, [result]);

  const showPersonHandler = (name) => {
    getPerson({ variables: { name } });
  };

  if (person) {
    return (
      <div>
        <h2>{person.name}</h2>
        <div>{`${person.id}, ${person.name}, ${person.address.street}`}</div>
        <button onClick={() => setPerson(null)}>Close</button>
      </div>
    );
  }

  if (persons === null) return;

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((person) => (
        <div
          key={person.id}
          onClick={() => showPersonHandler(person.name)}
        >{`${person.id}, ${person.name}, ${person.address.street}`}</div>
      ))}
    </div>
  );
};

export default Persons;
