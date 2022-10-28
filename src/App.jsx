import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import PhoneForm from "./PhoneForm";
import LoginForm from "./LoginForm";
import { usePersons } from "./persons/custom-hooks";
import Notify from "./Notify";
import { useApolloClient } from "@apollo/client";


function App(props) {
  const { data, loading, error } = usePersons();
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(() => !!localStorage.getItem("phonenumbers-user-token"));
  const client = useApolloClient()

  if (error) return <span style="color: red">{error}</span>;

const logout = () => {
  setToken(null)
  localStorage.clear()
  client.clearStore()
}

  const notifyError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };



  return (
    <div className="App">
      <Notify errorMessage={errorMessage}/>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {loading && <p>Loading..</p>}
      {!loading && <Persons persons={data?.allPersons} />}
      {token && <button onClick={logout}>Logout</button>}
      {!token && <LoginForm notifyError={notifyError} setToken={setToken} />}
      <PhoneForm notifyError={notifyError} />
      <PersonForm notifyError={notifyError} />
    </div>
  );
}

export default App;
