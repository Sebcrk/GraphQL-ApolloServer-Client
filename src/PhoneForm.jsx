import React, { useEffect, useState } from "react";
import { useEditNumber } from "./persons/custom-hooks";

const PhoneForm = ({ notifyError }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { editNumber, result } = useEditNumber();

  useEffect(() => {
    if(result.data && result.data.editNumber === null) {
        notifyError("Person not found")
    }
  }, [result.data])
  
  
  const submitHandler = (e) => {
    e.preventDefault();

    editNumber({
      variables: {
        name,
        phone,
      },
    });

    setName("");
    setPhone("");
  };

  return (
    <div>
      <h2>Change Phone Number</h2>
      <form onSubmit={submitHandler}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Change Phone</button>
      </form>
    </div>
  );
};

export default PhoneForm;
