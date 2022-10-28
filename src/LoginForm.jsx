import React, { useEffect, useState } from "react";
import { useLogin } from "./persons/custom-hooks";
import Notify from "./Notify";

const LoginForm = ({ notifyError, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, result } = useLogin(notifyError);

  useEffect(() => {
    if(result.data) {
        const token = result.data.login.value
        setToken(token)
        localStorage.setItem("phonenumbers-user-token", token)
    }
  }, [result.data])

  const onSubmitHandler = (event) => {
    event.preventDefault()

    login({
        variables: {
            username,
            password
        }
    })
  };


  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      
    </div>
  );
};

export default LoginForm;
