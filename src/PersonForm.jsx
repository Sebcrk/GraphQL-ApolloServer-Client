import React, { useState } from "react";
import { useAddPerson } from "./persons/custom-hooks";

const PersonForm = ({notifyError}) => {
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const { createPerson } = useAddPerson(notifyError);



  const submitHandler = (e) => {
    e.preventDefault();

    createPerson({
      variables: {
        name,
        street,
        city,
      },
    });

    setName("");
    setStreet("");
    setCity("");
  };

  return (
    <div>
      <h2>Create new Person</h2>
      <form onSubmit={submitHandler}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <button type="submit">Add Person</button>
      </form>
    </div>
  );
};

export default PersonForm;
